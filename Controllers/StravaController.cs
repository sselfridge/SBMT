using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback([FromServices] IServiceScopeFactory serviceScopeFactory, string code, string scope)
    {

      var oAuth = await _stravaService.GetTokens(code);

      var oAuthUser = new OauthStravaUser(oAuth);

      var claims = new List<Claim>
        {
            //new Claim(ClaimTypes.Name, oAuthUser.AthleteId),
            new Claim("AthleteId", $"{oAuthUser.AthleteId}"),
        };

      if (oAuthUser.AthleteId == 1075670)
      {
        var adminClaim = new Claim(ClaimTypes.Role, "Administrator");
        claims.Add(adminClaim);
      }


      var claimsIdentity = new ClaimsIdentity(
          claims, CookieAuthenticationDefaults.AuthenticationScheme);

      var authProperties = new AuthenticationProperties
      {
        //AllowRefresh = < bool >,
        // Refreshing the authentication session should be allowed.

        ExpiresUtc = DateTimeOffset.UtcNow.AddDays(10),
        // The time at which the authentication ticket expires. A 
        // value set here overrides the ExpireTimeSpan option of 
        // CookieAuthenticationOptions set with AddCookie.

        IsPersistent = true,
        // Whether the authentication session is persisted across 
        // multiple requests. When used with cookies, controls
        // whether the cookie's lifetime is absolute (matching the
        // lifetime of the authentication ticket) or session-based.

        //IssuedUtc = <DateTimeOffset>,
        // The time at which the authentication ticket was issued.

        //RedirectUri = <string>
        // The full path or absolute URI to be used as an http 
        // redirect response value.
      };

      await HttpContext.SignInAsync(
          CookieAuthenticationDefaults.AuthenticationScheme,
          new ClaimsPrincipal(claimsIdentity),
          authProperties);


      var existingUser = _userService.GetById(oAuthUser.AthleteId);
      if (existingUser == null)
      {
        await StravaUtilities.OnBoardNewUser(serviceScopeFactory, oAuthUser, _stravaService, _dbContext);
        return Redirect($"{Configuration["BaseURL"]}/beta/thanks");

      }
      else if (oAuthUser.AccessToken != existingUser.AccessToken)
      {
        existingUser.AccessToken = oAuthUser.AccessToken;
        existingUser.ExpiresAt = oAuthUser.ExpiresAt;
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



        return Ok("Created");

      }
      return Ok();
    }

    [HttpGet("userRefresh/{athleteId}")]
    public async Task<IActionResult> RefreshUser(int athleteId)
    {
      var user = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == athleteId);
      if (user == null) return NotFound();

      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;

      if (userId == null) return NotFound();

      var cookieAthleteId = Int32.Parse(userId);

      if (cookieAthleteId != user.AthleteId)
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

      return Ok(user);
    }

  }
}
