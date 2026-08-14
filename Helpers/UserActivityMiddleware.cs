namespace TodoApi.Helpers
{
  using TodoApi.Services;

  public class UserActivityMiddleware
  {
    private readonly RequestDelegate _next;

    public UserActivityMiddleware(RequestDelegate next)
    {
      _next = next;
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
