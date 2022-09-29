using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
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

    private string GenerateJwtToken(int id)
    {
      // generate token that is valid for 30 days
      var tokenHandler = new JwtSecurityTokenHandler();
      var jwtKey = Configuration["jwtKey"];
      var key = Encoding.ASCII.GetBytes(jwtKey);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
        Expires = DateTime.UtcNow.AddDays(300),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }



    public StravaController(
      IConfiguration configuration,
      IUserService userService,
      sbmtContext dbContext, IStravaService stravaService
      )
    {
      _dbContext = dbContext;
      Configuration = configuration;
      _userService = userService;
      _stravaService = stravaService;
    }

    // GET: api/TodoItems
    [HttpGet("callback")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback(string code, string scope)
    {

      var oAuth = await _stravaService.GetTokens(code);

      StravaUser newUser = new StravaUser(oAuth);

      var userExists = _userService.GetById(newUser.AthleteId);

      if (userExists == null)
      {
        await _userService.Add(newUser);
      }

      var cookie = GenerateJwtToken(newUser.AthleteId);
      HttpContext.Response.Cookies.Append("SBMT", cookie.ToString());


      return Redirect("http://localhost:3000");
    }

    //Verify push notifications subscription
    [HttpGet("push")]
    public IActionResult pushVerify()
    {
      string challenge = HttpContext.Request.Query["hub.challenge"];
      string mode = HttpContext.Request.Query["hub.mode"];
      string verify = HttpContext.Request.Query["hub.verify_token"];

      //TODO - Log verify code here

      return Ok(new SubChallengeRepsonse(challenge));

    }

    [HttpPost("push")]
    public async Task<IActionResult> pushNotificaitonAsync()
    {
      Stream req = Request.Body;
      var json = await new StreamReader(req).ReadToEndAsync();
      StravaPushNotificationDTO? subRes = JsonSerializer.Deserialize<StravaPushNotificationDTO>(json);
      if (subRes != null)
      {
        var pushNotification = new StravaPushNotification(subRes);
        //var updates = JsonSerializer.Deserialize<JsonObject>(pushNotification.Updates);
        _dbContext.StravaPushNotifications.Add(pushNotification);
        await _dbContext.SaveChangesAsync();
        return Ok("Created");

      }
      return Ok();
    }

    [HttpGet("athlete/id")]
    public async Task<IActionResult> GetAthleteIdAsync()
    {

      var possibleNulUser = HttpContext.Items["User"];

      if (possibleNulUser == null)
      {
        return NotFound();

      }



      return Ok(possibleNulUser);
    }

    [HttpDelete("logout")]
    public IActionResult Logout()
    {

      HttpContext.Response.Cookies.Delete("SBMT");


      return Ok();
    }
  }
}
