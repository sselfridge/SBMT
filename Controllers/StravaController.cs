using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
    private readonly StravaOAuthContext _context;
    private readonly IConfiguration Configuration;
    private IUserService _userService;

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

    //private int CheckCookie()
    //{
    //  const token = HttpContext.Response.Cookies.get


    //}

    public StravaController(StravaOAuthContext context, IConfiguration configuration, IUserService userService
      )
    {
      _context = context;
      Configuration = configuration;
      _userService = userService;
    }

    // GET: api/TodoItems
    [HttpGet("callback")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback(string code, string scope)
    {

      var oAuth = await StravaServices.GetTokens(code);

      StravaAthlete athlete = oAuth.Athlete;

      StravaUser newUser = new StravaUser(athlete);

      var userExists = _userService.GetById(newUser.AthleteId);

      if (userExists == null)
      {
        await _userService.Add(newUser);
      }

      var cookie = GenerateJwtToken(newUser.AthleteId);
      HttpContext.Response.Cookies.Append("SBMT", cookie.ToString());


      return Redirect("http://localhost:3000");
    }

    [HttpGet("athlete/id")]
    public IActionResult GetAthleteId()
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
