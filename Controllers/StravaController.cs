using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Services;


namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StravaController : ControllerBase
  {
    private readonly StravaOAuthContext _context;
    private ApplicationContext _appContext;
    private readonly IConfiguration Configuration;

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

    public StravaController(StravaOAuthContext context, ApplicationContext appContext, IConfiguration configuration)
    {
      _context = context;
      _appContext = appContext;
      Configuration = configuration;
    }

    // GET: api/TodoItems
    [HttpGet("callback")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback(string code, string scope)
    {

      var oAuth = await StravaServices.GetTokens(code);

      StravaAthlete athlete = oAuth.Athlete;

      StravaUser newUser = new StravaUser(athlete);

      var cookie = GenerateJwtToken(newUser.AthleteId);
      HttpContext.Response.Cookies.Append("SBMT", cookie.ToString());


      return Redirect("http://localhost:3000");
    }

    [HttpGet("AthleteId")]
    public IActionResult GetAthleteId()
    {

      var possibleNulUser = HttpContext.Items["User"];

      if (possibleNulUser == null)
      {
        return NotFound();

      }




      return Ok(123);
    }

  }
}
