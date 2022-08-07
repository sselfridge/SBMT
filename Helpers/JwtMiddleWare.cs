namespace TodoApi.Helpers
{
  using Microsoft.Extensions.Options;
  using Microsoft.IdentityModel.Tokens;
  using System.IdentityModel.Tokens.Jwt;
  using System.Text;
  using TodoApi.Models;
  using TodoApi.Services;

  //Taken from
  //{
  //  https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //}:
  public class JwtMiddleware
  {
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
      _next = next;
    }

    public async Task Invoke(HttpContext context, IUserService userService)
    {
      //var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYmYiOjE2NTk5MDAwNDcsImV4cCI6MTY2MDUwNDg0NywiaWF0IjoxNjU5OTAwMDQ3fQ.nS5Hg9GBMe_UJ8uDj4BrvH8WAftTAUg9H-yWTs3nwXA";
      if (token != null)
        attachUserToContext(context, userService, token);

      await _next(context);
    }

    private void attachUserToContext(HttpContext context, IUserService userService, string token)
    {
      try
      {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes("hellotherehellotherehellotherehellothere");
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
        var user = userService.GetById(userId);
        context.Items["User"] = user;
        Console.WriteLine("check cont");
      }
      catch
      {
        // do nothing if jwt validation fails
        // user is not attached to context so request won't have access to secure routes
      }
    }
  }
}
