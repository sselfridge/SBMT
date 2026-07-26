namespace TodoApi.Helpers
{
  using TodoApi.Services;

  // Originally this was where I added the JWT, but have moved to using dotnet auth
  // see initialization in stravaController:callback function
  // now this is just middleware being used to do some logging

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
      var date = DateTime.UtcNow;
      TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById("Pacific Standard Time");

      // it's a simple one-liner
      DateTime pacific = TimeZoneInfo.ConvertTimeFromUtc(date, tzi);

      Console.WriteLine(
        $"sbmtLog({context.Request.Headers["x-forwarded-for"]}):{context.Request.Path}\t\t{pacific.ToString()}"
      );
      Console.WriteLine(
        $"userAgent({context.Request.Headers["User-Agent"]}):{context.Request.Path}"
      );
      await _next(context);
    }
  }
}
