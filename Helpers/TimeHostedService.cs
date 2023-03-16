namespace TodoApi.Helpers
{
  public class TimedHostedService : IHostedService, IDisposable
  {
    private int executionCount = 0;
    private readonly ILogger<TimedHostedService> _logger;
    private IServiceScopeFactory _serviceScopeFactory;
    private Timer? _timer = null;

    public TimedHostedService(ILogger<TimedHostedService> logger, IServiceScopeFactory serviceScopeFactory)
    {
      _logger = logger;
      _serviceScopeFactory = serviceScopeFactory;
    }

    public Task StartAsync(CancellationToken stoppingToken)
    {
      _logger.LogInformation("Timed Hosted Service running.");
      Console.WriteLine($"DoWork-=-=-=-=-=-=-=-=-=-=-=-=---=-=-=-=-==--=");

      _timer = new Timer(DoWork, null, TimeSpan.Zero,
          TimeSpan.FromHours(24));

      return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
      var count = Interlocked.Increment(ref executionCount);
      //StravaUtilities.UpdateAllUserStats(_serviceScopeFactory);
      Console.WriteLine($"sbmtLog DoWork{count} -=-=-=-=-=-=-=-=-=-=-=-=---=-=-=-=-==--=");
      _logger.LogInformation(
          "Timed Hosted Service is working. Count: {Count}", count);
    }

    public Task StopAsync(CancellationToken stoppingToken)
    {
      _logger.LogInformation("Timed Hosted Service is stopping.");

      _timer?.Change(Timeout.Infinite, 0);

      return Task.CompletedTask;
    }

    public void Dispose()
    {
      _timer?.Dispose();
    }
  }
}
