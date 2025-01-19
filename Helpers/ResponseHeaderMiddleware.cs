namespace TodoApi.Helpers
{
  using TodoApi.Services;

  //Taken from
  //{
  //  https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //}:
  public class ResponseHeaderMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IConfiguration Configuration;
    private StravaLimitService RateLimits;

    public ResponseHeaderMiddleware(
      RequestDelegate next,
      IConfiguration configuration,
      StravaLimitService rateLimits
    )
    {
      _next = next;
      Configuration = configuration;
      RateLimits = rateLimits;
    }

    public async Task Invoke(HttpContext context, IUserService userService)
    {
      var usage15 = RateLimits.GetUsage15();
      context.Response.Headers.Add("X-Usage-15", $"{usage15}");

      var usageDaily = RateLimits.GetUsageDaily();
      context.Response.Headers.Add("X-Usage-Daily", $"{usageDaily}");
      await _next.Invoke(context);
    }
  }
}
