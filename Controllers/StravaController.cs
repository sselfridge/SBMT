using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using TodoApi.Helpers;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Models.stravaApi;
using TodoApi.Services;

namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StravaController : ControllerBase
  {
    private sbmtContext _dbContext;

    private readonly IConfiguration Configuration;

    private IUserService _userService;

    private IStravaService _stravaService;

    private IServiceScopeFactory _serviceScopeFactory;

    private string GenerateJwtToken(int id)
    {
      // generate token that is valid for 30 days
      var tokenHandler = new JwtSecurityTokenHandler();
      var jwtKey = Configuration["jwtKey"];
      var key = Encoding.ASCII.GetBytes(jwtKey);
      var tokenDescriptor =
          new SecurityTokenDescriptor
          {
            Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
            Expires = DateTime.UtcNow.AddDays(300),
            SigningCredentials =
                  new SigningCredentials(new SymmetricSecurityKey(key),
                      SecurityAlgorithms.HmacSha256Signature)
          };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    public StravaController(
        IConfiguration configuration,
        IUserService userService,
        sbmtContext dbContext,
        IStravaService stravaService,
        IServiceScopeFactory serviceScopeFactory
    )
    {
      _dbContext = dbContext;
      Configuration = configuration;
      _userService = userService;
      _stravaService = stravaService;
      _serviceScopeFactory = serviceScopeFactory;
    }

    [HttpGet("callback")]
    public async Task<ActionResult<IEnumerable<TodoItem>>>
    GetStravaCallback(
          [FromServices] IServiceScopeFactory serviceScopeFactory,
          string code,
          string scope
                      )
    {
      if (scope == null) scope = "notNull";

      var scopeHasRead = scope.IndexOf("read,") == 0;
      var scopeHasActivityRead = scope.IndexOf("activity:read,") != -1;
      var scopeHasProfileAll = scope.IndexOf("profile:read_all") != -1;

      var oAuth = await _stravaService.GetTokens(code);

      var oAuthUser = new OauthStravaUser(oAuth, scope);


      var cookie = GenerateJwtToken(oAuthUser.AthleteId);
      HttpContext.Response.Cookies.Append("SBMT", cookie.ToString());

      var existingUser = _userService.GetById(oAuthUser.AthleteId);
      if (existingUser == null)
      {
        await StravaUtilities
            .OnBoardNewUser(serviceScopeFactory,
            oAuthUser,
            _stravaService,
            _dbContext);
        return Redirect($"{Configuration["BaseURL"]}/beta/thanks?{scope}");
      }
      else if (
        (oAuthUser.AccessToken != existingUser.AccessToken) ||
        (existingUser.Scope != oAuthUser.Scope))
      {

        if ((oAuthUser.AccessToken != existingUser.AccessToken))
        {
          existingUser.AccessToken = oAuthUser.AccessToken;
          existingUser.ExpiresAt = oAuthUser.ExpiresAt;
        }

        if (existingUser.Scope != oAuthUser.Scope)
        {
          existingUser.Scope = oAuthUser.Scope;
        }
        var savedUser = await _userService.Update(existingUser);
      }

      return Redirect($"{Configuration["BaseURL"]}/beta/thanks");
    }

    //Verify push notifications subscription
    [HttpGet("push")]
    public IActionResult pushVerify()
    {
      string challenge = HttpContext.Request.Query["hub.challenge"];
      string mode = HttpContext.Request.Query["hub.mode"];
      string verify = HttpContext.Request.Query["hub.verify_token"];

      //TODO - Log verify code here
      if (verify == Configuration["WebHookVerify"])
      {
        return Ok(new SubChallengeRepsonse(challenge));
      }

      return BadRequest();
    }

    [HttpPost("push")]
    public async Task<IActionResult> pushNotificaitonAsync()
    {
      Stream req = Request.Body;
      var json = await new StreamReader(req).ReadToEndAsync();
      StravaPushNotificationDTO? subRes = null;

      subRes = JsonSerializer.Deserialize<StravaPushNotificationDTO>(json);

      if (subRes != null)
      {
        var pushNotification = new StravaPushNotification(subRes);

        //var updates = JsonSerializer.Deserialize<JsonObject>(pushNotification.Updates);
        _dbContext.StravaPushNotifications.Add(pushNotification);
        await _dbContext.SaveChangesAsync();

        if (pushNotification.AspectType == "create")
        {
          var athleteId = pushNotification.OwnerId;
          if (_dbContext.StravaUsers.Any(u => u.AthleteId == athleteId))
          {
            var activityId = pushNotification.ObjectId;

#pragma warning disable CS4014
            StravaUtilities.ParseNewActivity(_serviceScopeFactory, athleteId, activityId);
#pragma warning restore CS4014

          }
        }

        //TODO - if we get a response that user has unauthorized the app, need to delete their data.
        //AspectType, EventTime,  ObjectId, ObjectType ,  OwnerId,  SubscriptionId, Updates
        //update      1669003547  10645041  athlete       10645041  227851          { "authorized": "false" }
        //TODO handle delete activity notification
        //delete  1668977815  8146456392  activity  19340963  227851  { }
        return Ok("Created");
      }
      return Ok();
    }

    [HttpGet("userRefresh/{athleteId}")]
    public async Task<IActionResult> RefreshUser(int athleteId)
    {
      var user = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == athleteId);

      if (user == null) return NotFound();

      var cookieUser = HttpContext.Items["User"];
      if (cookieUser == null) return Unauthorized();

      StravaUser currentUser = (StravaUser)cookieUser;

      if (currentUser.AthleteId != user.AthleteId)
      {
        return Forbid();
      }

      var profile = await _stravaService.GetProfile(athleteId, _dbContext);

      if (profile == null) return NotFound();

      user.Firstname = profile.Firstname;
      user.Lastname = profile.Lastname;
      user.Avatar = profile.ProfileMedium;
      if (profile.Sex != null)
      {
        user.Sex = profile.Sex;
      }
      if (profile.Weight != null)
      {
        user.Weight = (double)profile.Weight;
      }

      await _userService.Update(user, _dbContext);

      HttpContext.Items["User"] = user;

      return Ok(user);
    }
  }
}
