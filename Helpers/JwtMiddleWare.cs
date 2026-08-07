namespace TodoApi.Helpers
{
  using System.IdentityModel.Tokens.Jwt;
  using System.Text;
  using Microsoft.IdentityModel.Tokens;
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
      attachUserToContext(context, userService);

      var date = DateTime.UtcNow;
      TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");
      DateTime pacific = TimeZoneInfo.ConvertTimeFromUtc(date, tzi);

      Console.WriteLine(
        $"sbmtLog({context.Request.Headers["x-forwarded-for"]}):{context.Request.Path}\t\t{pacific.ToString()}"
      );
      Console.WriteLine(
        $"userAgent({context.Request.Headers["User-Agent"]}):{context.Request.Path}"
      );
      await _next(context);
    }

    private void attachUserToContext(HttpContext context, IUserService userService)
    {
      var cookie = context.Request.Cookies["SBMT"];
      if (cookie == null)
      {
        return;
      }
      attachUserToContext(context, userService, cookie);

      Console.WriteLine("AttachUserToContext");
    }

    private void attachUserToContext(HttpContext context, IUserService userService, string token)
    {
      try
      {
        var tokenHandler = new JwtSecurityTokenHandler();
        string? jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
        if (string.IsNullOrEmpty(jwtKey))
        {
          throw new ArgumentException("Invalid ENV value for JWT_KEY");
        }
        var key = Encoding.ASCII.GetBytes(jwtKey);
        tokenHandler.ValidateToken(
          token,
          new TokenValidationParameters
          {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
            // ClockSkew = TimeSpan.Zero,
          },
          out SecurityToken validatedToken
        );

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
