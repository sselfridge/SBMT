namespace TodoApi.Helpers
{
  using Microsoft.IdentityModel.Tokens;
  using System.IdentityModel.Tokens.Jwt;
  using System.Text;
  using TodoApi.Models.db;
  using TodoApi.Services;

  //Taken from
  //{
  //  https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //}:
  public class JwtMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IConfiguration Configuration;



    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
      _next = next;
      Configuration = configuration;
    }

    public async Task Invoke(HttpContext context, IUserService userService)
    {
      // keep this to remind/shame me into doing proper auth headers
      //var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();


      //attachUserToContext(context, userService);

      var date = DateTime.UtcNow;
      TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");

      // it's a simple one-liner
      DateTime pacific = TimeZoneInfo.ConvertTimeFromUtc(date, tzi);

      Console.WriteLine($"sbmtLog({context.Request.Headers["x-forwarded-for"]}):{context.Request.Path}\t\t{pacific.ToString()}");
      Console.WriteLine($"userAgent({context.Request.Headers["User-Agent"]}):{context.Request.Path}");
      await _next(context);
    }

    private void attachUserToContext(HttpContext context, IUserService userService)
    {
      var cookieId = context.User.Claims.FirstOrDefault(
             c => c.Type == "AthleteId")?.Value;

      if (cookieId != null)
      {
        var athleteId = int.Parse(cookieId);
        StravaUser? user = userService.GetById(athleteId);
        if (user != null)
        {
          context.Items["User"] = user;
          Console.WriteLine($"sbmtLog:user:{user.AthleteId} - {user.Firstname} {user.Lastname}");
        }
      }



      Console.WriteLine("allo");


    }

    private void attachUserToContext(HttpContext context, IUserService userService, string token)
    {
      //Old invocation of this:
      //var token = context.Request.Cookies["SBMT"];
      //if (token != null)
      //  attachUserToContext(context, userService, token);

      // JWT generation from stravaController
      //private string GenerateJwtToken(int id)
      //{
      //  // generate token that is valid for 30 days
      //  var tokenHandler = new JwtSecurityTokenHandler();
      //  var jwtKey = Configuration["jwtKey"];
      //  var key = Encoding.ASCII.GetBytes(jwtKey);
      //  var tokenDescriptor = new SecurityTokenDescriptor
      //  {
      //    Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
      //    Expires = DateTime.UtcNow.AddDays(300),
      //    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      //  };
      //  var token = tokenHandler.CreateToken(tokenDescriptor);
      //  return tokenHandler.WriteToken(token);
      //}

      //Added on login:
      //var cookie = GenerateJwtToken(oAuthUser.AthleteId);
      //HttpContext.Response.Cookies.Append("SBMT", cookie.ToString());

      try
      {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtKey = Configuration["jwtKey"];

        var key = Encoding.ASCII.GetBytes(jwtKey);
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false,
          // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
          ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

        // attach user to context on successful jwt validation
        StravaUser? user = userService.GetById(userId);
        if (user != null)
        {
          context.Items["User"] = user;
          Console.WriteLine($"sbmtLog:user:{user.AthleteId} - {user.Firstname} {user.Lastname}");

        }

      }
      catch
      {
        // do nothing if jwt validation fails
        // user is not attached to context so request won't have access to secure routes
      }
    }
  }
}
