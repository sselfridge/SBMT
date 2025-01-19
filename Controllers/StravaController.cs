using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback(
      [FromServices] IServiceScopeFactory serviceScopeFactory,
      string? code,
      string? scope,
      string? error
    )
    {
      if ((error != null) || (code == null || scope == null))
      {
        return Redirect($"{Configuration["BaseURL"]}/stravaoops?error={error}");
      }

      var oAuth = await _stravaService.GetTokens(code);

      var oAuthUser = new OauthStravaUser(oAuth, scope);

      //setup login cookie
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
        claims,
        CookieAuthenticationDefaults.AuthenticationScheme
      );

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
        authProperties
      );

      var existingUser = _userService.GetById(oAuthUser.AthleteId);
      if (existingUser == null)
      {
        Console.WriteLine(
          $"sbmtLog: On boarding new athleteId: {oAuthUser.AthleteId} with scope '{scope}'"
        );
        await StravaUtilities.OnBoardNewUser(
          serviceScopeFactory,
          oAuthUser,
          _stravaService,
          _dbContext
        );
        return Redirect($"{Configuration["BaseURL"]}/settings");
      }
      else
      {
        if (
          oAuthUser.AccessToken != existingUser.AccessToken
          || oAuthUser.Scope != existingUser.Scope
        )
        {
          existingUser.AccessToken = oAuthUser.AccessToken;
          existingUser.ExpiresAt = oAuthUser.ExpiresAt;
          existingUser.Scope = oAuthUser.Scope;
          var savedUser = await _userService.Update(existingUser);
        }

        if (oAuthUser.Scope.Contains("profile:read_all") && existingUser != null)
        {
          // this needs to be after the DB update since we probably need the new accesstoken
          // Could pass the token down if this becomes an issue.
          var userWithClubs = _dbContext
            .StravaUsers.Include(x => x.StravaClubs)
            .FirstOrDefault(x => x.AthleteId == oAuthUser.AthleteId);
          if (userWithClubs != null)
          {
            var profile = await _stravaService.GetProfile(oAuthUser.AthleteId);
            _stravaService.UpdateUserClubs(oAuthUser.AthleteId, profile.Clubs);
          }
        }

        if (existingUser != null && (existingUser.Age == 0 || existingUser.Category == null))
        {
          return Redirect($"{Configuration["BaseURL"]}/settings");
        }
        else
        {
          return Redirect($"{Configuration["BaseURL"]}/recent");
        }
      }
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

        var outStr =
          $"sbmtLog: New Strava Push-----"
          + $"Aspect:{pushNotification.AspectType} -----"
          + $"owner:{pushNotification.OwnerId} -----"
          + $"object:{pushNotification.ObjectId} -----"
          + $"updates:{pushNotification.Updates} -----";
        Console.WriteLine(outStr);

        if (
          (pushNotification.AspectType == "create" && pushNotification.ObjectType == "activity")
          || (
            pushNotification.AspectType == "update"
            && pushNotification.ObjectType == "activity"
            && pushNotification.Updates != null
            && pushNotification.Updates.Contains("private")
            && pushNotification.Updates.Contains("false")
          )
        )
        {
          DateTime startTime = new DateTime(2023, 5, 26, 8, 0, 0, 0, DateTimeKind.Utc);
          DateTime now = DateTime.UtcNow;
          if (startTime > now)
          {
            Console.WriteLine("sbmtLog: Not go time yet");
            return Ok();
          }

          var athleteId = pushNotification.OwnerId;
          if (_dbContext.StravaUsers.Any(u => u.AthleteId == athleteId))
          {
            var activityId = pushNotification.ObjectId;
#pragma warning disable CS4014
            StravaUtilities.ParseNewActivity(_serviceScopeFactory, athleteId, activityId, 0);
#pragma warning restore CS4014
          }
        }
        //User has canceled their auth via strava, remove from DB
        else if (
          pushNotification.AspectType == "update"
          && pushNotification.ObjectType == "athlete"
          && pushNotification.Updates != null
          && pushNotification.Updates.Contains("authorized")
          && pushNotification.Updates.Contains("false")
        )
        {
          var athleteId = pushNotification.OwnerId;
          await _userService.DeleteUser(athleteId);
        }
        //Either activity was deleted or made private, either way remove from the efforts table
        else if (
          (pushNotification.AspectType == "delete" && pushNotification.ObjectType == "activity")
          || (
            pushNotification.AspectType == "update"
            && pushNotification.ObjectType == "activity"
            && pushNotification.Updates != null
            && pushNotification.Updates.Contains("private")
            && pushNotification.Updates.Contains("true")
          )
        )
        {
          var effortsToDelete = _dbContext
            .Efforts.Where(effort => effort.ActivityId == pushNotification.ObjectId)
            .ToList();
          _dbContext.Efforts.RemoveRange(effortsToDelete);
          _dbContext.SaveChanges();
        }

        return Ok("Done and Done");
      }
      return Ok();
    }

    [HttpGet("userRefresh/{athleteId}")]
    public async Task<IActionResult> RefreshUser(int athleteId)
    {
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;

      if (userId == null)
        return NotFound();

      var cookieAthleteId = Int32.Parse(userId);

      var profile = await _stravaService.GetProfile(athleteId);

      if (profile == null)
        return NotFound();

      var user = _dbContext
        .StravaUsers.Include(x => x.StravaClubs)
        .FirstOrDefault(u => u.AthleteId == athleteId);

      if (user == null)
        return NotFound();
      if (cookieAthleteId != user.AthleteId)
      {
        return Forbid();
      }

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

      //doesn't play nice with scope context in updateuserclubs
      //making an extra DB save call here, should probably condense all the user updates
      //together.
      _dbContext.Update(user);
      _dbContext.SaveChanges();

      user = _stravaService.UpdateUserClubs(user.AthleteId, profile.Clubs);

      var returnUser = new StravaUserDTO(user);

      return Ok(returnUser);
    }

    [HttpGet("parse/{link}")]
    public async Task<string> ParseLink(string link)
    {
      var result = await _stravaService.ParseLink(link);
      return result;
    }
  }
}
