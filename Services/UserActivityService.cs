namespace TodoApi.Services
{
  using Microsoft.Extensions.DependencyInjection;
  using TodoApi.Helpers;
  using TodoApi.Models;
  using TodoApi.Models.db;

  public interface IUserActivityService
  {
    public Task AddUrl(string url);
  }

  public class UserActivityService : IUserActivityService
  {
    private sbmtContext _dbContext;
    private IServiceScopeFactory _serviceScopeFactory;

    public UserActivityService(sbmtContext dbContext, IServiceScopeFactory serviceScopeFactory)
    {
      _dbContext = dbContext;
      _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task AddUrl(string url)
    {
      var newUserActivity = new UserActivity("url", url);
      _dbContext.UserActivity.Add(newUserActivity);
      await _dbContext.SaveChangesAsync();
    }
  }
}
