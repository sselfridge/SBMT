namespace TodoApi.Helpers
{
  public class TimedHostedService : IHostedService, IDisposable
  {
    private int executionCount = 0;
    private readonly ILogger<TimedHostedService> _logger;
    private IServiceScopeFactory _serviceScopeFactory;
    private Timer? _timer = null;

    public TimedHostedService(
      ILogger<TimedHostedService> logger,
      IServiceScopeFactory serviceScopeFactory
    )
    {
      _logger = logger;
      _serviceScopeFactory = serviceScopeFactory;
    }

    public Task StartAsync(CancellationToken stoppingToken)
    {
      logMsg("Time Hosted Service Started");

      if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
      {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(24));
      }

      return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
      var count = Interlocked.Increment(ref executionCount);
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      StravaUtilities.UpdateAllUserStats(_serviceScopeFactory);
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      logMsg($"Time Hosted Service has run: {count} times");
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
      logMsg("Timed Hosted Service is stopping.");
      _timer?.Change(Timeout.Infinite, 0);

      return Task.CompletedTask;
    }

    public void Dispose()
    {
      _timer?.Dispose();
    }

    private void logMsg(string message)
    {
      _logger.LogInformation(
        "{} {} {}",
        message,
        TimeZoneInfo
          .ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Pacific Standard Time")
          .ToLongDateString(),
        TimeZoneInfo
          .ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Pacific Standard Time")
          .ToLongTimeString()
      );
    }
  }
}
