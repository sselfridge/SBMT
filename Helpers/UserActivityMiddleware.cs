namespace TodoApi.Helpers
{
  using TodoApi.Services;

  //Taken from
  //{
  //  https://jasonwatmore.com/post/2021/12/14/net-6-jwt-authentication-tutorial-with-example-api
  //}:
  public class UserActivityMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IConfiguration Configuration;

    public UserActivityMiddleware(RequestDelegate next, IConfiguration configuration)
    {
      _next = next;
      Configuration = configuration;
    }

    public async Task Invoke(HttpContext context, IUserActivityService userActivityService)
    {
      var request = context.Request;
      var fullUrl = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
      Console.WriteLine($"userURL:{fullUrl}");

      await userActivityService.AddUrl(fullUrl);

      await _next.Invoke(context);
    }
  }
}
