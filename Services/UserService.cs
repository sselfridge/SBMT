namespace TodoApi.Services
{
  using TodoApi.Models;
  using TodoApi.Models.db;

  public interface IUserService
  {
    IEnumerable<User> GetAll();
    //StravaUser? GetById(int id);
    StravaUser? GetById(int id, sbmtContext? scopeContext = null);
    Task Add(StravaUser user);
    //Task<StravaUser> Update(StravaUser user);
    Task<StravaUser> Update(StravaUser user, sbmtContext? scopeContext = null);
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


    //private readonly AppSettings _appSettings;

    public UserService(sbmtContext dbContext)
    {
      _dbContext = dbContext;
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

    public StravaUser? GetById(int id, sbmtContext? scopeContext)
    {
      sbmtContext dbContext = scopeContext ?? _dbContext;

      var user = dbContext.StravaUsers.FirstOrDefault(x => x.AthleteId == id);
      return user;
    }

    public async Task Add(StravaUser user)
    {
      _dbContext.StravaUsers.Add(user);
      await _dbContext.SaveChangesAsync();
    }

    //public async Task<StravaUser> Update(StravaUser user)
    //{
    //  return await Update(user, _dbContext);
    //}
    public async Task<StravaUser> Update(StravaUser user, sbmtContext? scopeContext)
    {
      sbmtContext dbContext = scopeContext ?? _dbContext;

      dbContext.Update(user);
      await dbContext.SaveChangesAsync();
      return user;
    }
  }
}
