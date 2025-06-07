namespace TodoApi.Services
{
  using Microsoft.Extensions.DependencyInjection;
  using TodoApi.Helpers;
  using TodoApi.Models;
  using TodoApi.Models.db;

  public interface IUserService
  {
    //StravaUser? GetById(int id);
    StravaUser? GetById(int id);
    Task Add(StravaUser user);

    //Task<StravaUser> Update(StravaUser user);
    Task<StravaUser> Update(StravaUser user);

    public List<UserSegment>? GetUserEfforts(int athleteId, string year);

    public Task<bool> DeleteUser(int athleteId);
  }

  public class UserService : IUserService
  {
    private sbmtContext _dbContext;
    private IServiceScopeFactory _serviceScopeFactory;

    //private readonly AppSettings _appSettings;

    public UserService(sbmtContext dbContext, IServiceScopeFactory serviceScopeFactory)
    {
      _dbContext = dbContext;
      _serviceScopeFactory = serviceScopeFactory;
    }

    public StravaUser? GetById(int id)
    {
      using (var scope = _serviceScopeFactory.CreateScope())
      {
        var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
        IConfiguration configuration = new ConfigurationBuilder()
          .AddJsonFile("appsettings.json")
          .Build();

        var appAthleteIdStr = configuration["AppAthleteId"];

        if ($"{id}" == appAthleteIdStr)
        {
          var appUser = context.StravaUsers.FirstOrDefault(x => x.AthleteId == id);
          return appUser;
        }

        var user = context.StravaUsers.Where(x => x.Active).FirstOrDefault(x => x.AthleteId == id);
        return user;
      }
    }

    public async Task Add(StravaUser user)
    {
      _dbContext.StravaUsers.Add(user);
      await _dbContext.SaveChangesAsync();
    }

    public async Task<StravaUser> Update(StravaUser user)
    {
      using (var scope = _serviceScopeFactory.CreateScope())
      {
        var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();

        context.Update(user);
        await context.SaveChangesAsync();
        return user;
      }
    }

    public List<UserSegment>? GetUserEfforts(int athleteId, string year)
    {
      var user = GetById(athleteId);
      if (user == null)
        return null;

      var kickOffDate = SbmtUtils.getKickOffDate(year);
      var endingDate = SbmtUtils.getEndingDate(year);

      var userEfforts = _dbContext
        .Efforts.Where(e => e.AthleteId == athleteId)
        .Where(x => x.StartDate > kickOffDate && x.StartDate < endingDate)
        .Join(
          _dbContext.Segments,
          effort => effort.SegmentId,
          segment => segment.Id,
          (effort, segment) =>
            new
            {
              effort.Id,
              effort.ElapsedTime,
              effort.SegmentId,
              SegmentName = segment.Name,
              effort.AthleteId,
              effort.CreatedAt,
              effort.ActivityId,
            }
        )
        .ToList();

      var userSegments = _dbContext
        .Segments.ToList()
        .Select(s => new UserSegment(athleteId, s.Id, s.Name, s.SurfaceType))
        .ToList();

      foreach (var i in userEfforts)
      {
        var userSegment = userSegments.Find(u => u.SegmentId == i.SegmentId);
        var effort = new UserSegmentEffort(i.Id, i.CreatedAt, i.ElapsedTime, i.ActivityId);
        if (userSegment == null)
          throw new Exception("Invalid SegmentID");

        userSegment.AddEffort(effort);
      }
      return userSegments;
    }

    public async Task<bool> DeleteUser(int athleteId)
    {
      Console.WriteLine($"Starting Deleting user {athleteId}");

      var dbUser = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == athleteId);
      if (dbUser == null)
        throw new Exception("User not found");
      var properties = typeof(StravaUser).GetProperties();
      foreach (var prop in properties)
      {
        if (prop.PropertyType == typeof(string) && prop.Name != "Years")
        {
          prop.SetValue(dbUser, string.Empty);
          // You can set it to null instead by uncommenting the line below
          // prop.SetValue(user, null);
        }
        else if (
          prop.Name != "AthleteId"
          && (
            prop.PropertyType == typeof(Int64)
            || prop.PropertyType == typeof(double)
            || prop.PropertyType == typeof(Int32)
          )
        )
        {
          prop.SetValue(dbUser, 0);
        }
        else if (prop.PropertyType == typeof(bool))
        {
          prop.SetValue(dbUser, false);
        }
        else if (prop.PropertyType == typeof(DateTime))
        {
          prop.SetValue(dbUser, new DateTime(0));
        }
        else if (prop.Name == "StravaClubs")
        {
          prop.SetValue(dbUser, new List<StravaClub>());
        }
        else
        {
          var proType = prop.PropertyType;
          Console.WriteLine("out");
        }
      }

      // var allEfforts = _dbContext.Efforts.Where(e => e.AthleteId == athleteId).ToList();
      // _dbContext.RemoveRange(allEfforts);
      //_dbContext.Remove(dbUser);
      await _dbContext.SaveChangesAsync();
      return true;
    }
  }
}
