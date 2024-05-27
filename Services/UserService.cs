namespace TodoApi.Services
{
  using Microsoft.Extensions.DependencyInjection;
  using TodoApi.Models;
  using TodoApi.Models.db;

  public interface IUserService
  {
    IEnumerable<User> GetAll();
    //StravaUser? GetById(int id);
    StravaUser? GetById(int id);
    Task Add(StravaUser user);
    //Task<StravaUser> Update(StravaUser user);
    Task<StravaUser> Update(StravaUser user);

    public List<UserSegment>? GetUserEfforts(int athleteId);

    public Task<bool> DeleteUser(int athleteId);

  }

  public class UserService : IUserService
  {
    // users hardcoded for simplicity, store in a db with hashed passwords in production applications
    private List<User> _users = new List<User>
    {
        new User { Id = 1, FirstName = "Test", LastName = "User", Username = "test", Password = "test" },
        new User { Id = 2, FirstName = "Tommy", LastName = "Tester", Username = "tomy", Password = "test" },
        new User { Id = 1075670, FirstName = "Samy", LastName = "Wise", Username = "tomy", Password = "test" }
    };

    private sbmtContext _dbContext;
    private IServiceScopeFactory _serviceScopeFactory;


    //private readonly AppSettings _appSettings;

    public UserService(sbmtContext dbContext, IServiceScopeFactory serviceScopeFactory)
    {
      _dbContext = dbContext;
      _serviceScopeFactory = serviceScopeFactory;
    }

    //public AuthenticateResponse Authenticate(AuthenticateRequest model)
    //{
    //  var user = _users.SingleOrDefault(x => x.Username == model.Username && x.Password == model.Password);

    //  // return null if user not found
    //  if (user == null) return null;

    //  // authentication successful so generate jwt token
    //  var token = "generateJwtToken(user);";

    //  return new AuthenticateResponse(user, token);
    //}

    public IEnumerable<User> GetAll()
    {
      return _users;
    }

    //public StravaUser? GetById(int id)
    //{
    //  return GetById(id, _dbContext);
    //}

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

    public List<UserSegment>? GetUserEfforts(int athleteId)
    {

      var user = GetById(athleteId);
      if (user == null) return null;


      IConfiguration configuration = new ConfigurationBuilder()
                               .AddJsonFile("appsettings.json")
                               .Build();

      var kickOffDateStr = configuration["KickOffDate"];
      var kickOffDate = DateTime.Parse(kickOffDateStr).ToUniversalTime();

      var userEfforts = _dbContext.Efforts
       .Where(e => e.AthleteId == athleteId)
               .Where(x => x.StartDate > kickOffDate)

       .Join(_dbContext.Segments,
       effort => effort.SegmentId,
       segment => segment.Id,
       (effort, segment) => new
       {
         Id = effort.Id,
         ElapsedTime = effort.ElapsedTime,
         SegmentId = effort.SegmentId,
         SegmentName = segment.Name,
         AthleteId = effort.AthleteId,
         CreatedAt = effort.CreatedAt,
         ActivityId = effort.ActivityId,
       }
       ).ToList();

      var userSegments = _dbContext.Segments.ToList()
        .Select(s => new UserSegment(athleteId, s.Id, s.Name, s.SurfaceType)).ToList();

      foreach (var i in userEfforts)
      {
        var userSegment = userSegments.Find(u => u.SegmentId == i.SegmentId);
        var effort = new UserSegmentEffort(i.Id, i.CreatedAt, i.ElapsedTime, i.ActivityId);
        if (userSegment == null) throw new Exception("Invalid SegmentID");

        userSegment.AddEffort(effort);

      }
      return userSegments;
    }

    public async Task<bool> DeleteUser(int athleteId)
    {
      var dbUser = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == athleteId);
      if (dbUser == null) throw new Exception("User not found");
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
          prop.Name != "AthleteId" && (
          prop.PropertyType == typeof(Int64) ||
          prop.PropertyType == typeof(double) ||
          prop.PropertyType == typeof(Int32)
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
