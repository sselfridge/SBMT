using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Helpers;
using TodoApi.Models.db;
using TodoApi.Services;

namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TodoItemsController : ControllerBase
  {
    private sbmtContext _dbContext;
    private IUserService _userService;
    private IStravaService _stravaService;
    private readonly IConfiguration Configuration;
    private StravaLimitService RateLimits;
    private IServiceScopeFactory _serviceScopeFactory;
    private ILogger<TodoItemsController> _logger;

    private string GenerateJwtToken(int id)
    {
      // generate token that is valid for 30 days
      var tokenHandler = new JwtSecurityTokenHandler();
      // var jwtKey = Configuration["jwtKey"];
      string? jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
      if (string.IsNullOrEmpty(jwtKey))
      {
        throw new ArgumentException("Invalid ENV value for JWT_KEY");
      }

      var key = Encoding.ASCII.GetBytes(jwtKey);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
        Expires = DateTime.UtcNow.AddDays(300),
        SigningCredentials = new SigningCredentials(
          new SymmetricSecurityKey(key),
          SecurityAlgorithms.HmacSha256Signature //cspell: disable-line
        ),
      };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }

    private async Task<List<Effort>> FetchEffortsForUser(StravaUser user, List<long> list)
    {
      using (var scope = _serviceScopeFactory.CreateScope())
      {
        var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
        var count = 0;
        try
        {
          var activities = await _stravaService.GetActivities(user.AthleteId);
          var newEfforts = new List<Effort>();
          foreach (var act in activities)
          {
            count++;
            var fullActivity = await _stravaService.GetActivity(act.Id, user.AthleteId);
            var efforts = StravaUtilities.PullEffortsFromActivity(fullActivity, list);
            if (efforts.Count > 0)
            {
              newEfforts.AddRange(efforts);
            }
          }

          var newStudent = new Student();
          newStudent.Name = "Bobby";
          newStudent.Age = count;
          newStudent.Grade = 12344596;

          _dbContext.Students.Add(newStudent);
          _dbContext.SaveChanges();

          return newEfforts;
        }
        catch (Exception e)
        {
          Console.WriteLine($"Error with user:{user.Firstname} {user.Lastname}");
          Console.WriteLine(e.ToString());
          return new List<Effort>();
          throw;
        }
      }
      return new List<Effort>();
    }

    private async Task<List<Effort>> ScanAllAthletesForSegments()
    {
      var count = 0;

      var list = new List<long>() { 647488 };

      IConfiguration configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

      var appAthleteIdStr = configuration["AppAthleteId"];
      int appAthleteId = int.Parse(appAthleteIdStr);

      var users = _dbContext.StravaUsers.ToList();
      var realUsers = new List<StravaUser>();

      foreach (var user in users)
      {
        if (user == null || user.AthleteId == appAthleteId)
          continue;
        // for 504 activities was ~7min
        // 40.81 - running in parallel no DB calls
        //
        realUsers.Add(user);
      }
      _dbContext.ChangeTracker.Clear();

      var taskList = realUsers.Select(user => FetchEffortsForUser(user, list));

      var bigArray = await Task.WhenAll(taskList);
      var bigList = bigArray.ToList();

      var newEfforts = bigList.SelectMany(x => x).ToList();

      var newSegmentEfforts = new List<Effort>();

      foreach (var effort in newEfforts)
      {
        var effortExists = _dbContext.Efforts.Any(e => e.Id == effort.Id);
        if (effortExists == false)
        {
          newSegmentEfforts.Add(effort);
        }
      }

      _dbContext.AddRange(newSegmentEfforts);
      _dbContext.SaveChanges();

      Console.WriteLine($"Total activities:{count}");
      return newSegmentEfforts;
    }

    public TodoItemsController(
      IUserService userService,
      IStravaService stravaService,
      sbmtContext dbContext,
      IConfiguration configuration,
      StravaLimitService stravaLimitService,
      IServiceScopeFactory serviceScopeFactory,
      ILogger<TodoItemsController> logger
    )
    {
      _userService = userService;
      _stravaService = stravaService;
      _dbContext = dbContext;
      Configuration = configuration;
      RateLimits = stravaLimitService;
      _serviceScopeFactory = serviceScopeFactory;
      _logger = logger;
    }

    [HttpGet()]
    ///http://localhost:5000/api/todoitems
    public async Task<ActionResult<long>> TestThing(
      [FromServices] IServiceScopeFactory serviceScopeFactory
    )
    {
      var count = _dbContext.StravaUsers.Count();
      Console.WriteLine($"sbmtLog {count} users in DB");

      var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
      Console.WriteLine($"Current ENV:{env}");

      if (env != "Development" && env != "LocalProd" && env != "Staging")
      {
        return Ok("Non-Dev Loaded!");
      }

      //rescan activity
      //await StravaUtilities.ParseNewActivity(_serviceScopeFactory, 7095846, 14799038858, 0);

      var kickOffDate = SbmtUtils.getKickOffDate("2025sbmt");

      //await StravaUtilities.ParseNewActivity(
      //  _serviceScopeFactory,
      //  effort.AthleteId,
      //  effort.ActivityId,
      //  0
      //);

      return Ok(kickOffDate);

      var newStudent = new Student();
      newStudent.Name = "Bobby";
      newStudent.Age = 34;
      newStudent.Grade = 10;

      _dbContext.Students.Add(newStudent);
      _dbContext.SaveChanges();
      var newCookie = GenerateJwtToken(1234);

      var fifteen = RateLimits.GetUsage15();
      var daily = RateLimits.GetUsageDaily();

      int[] rates = new int[] { fifteen, daily };

      return Ok("Shouldn't get here");
    }

    // GET: api/TodoItems
    //[HttpGet]
    //public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
    //{
    //  if (_context.TodoItems == null)
    //  {
    //    return NotFound();
    //  }
    //  return await _context.TodoItems.ToListAsync();
    //}

    public static void ConvertDatesToUniversal(object obj)
    {
      if (obj == null)
      {
        throw new ArgumentNullException(nameof(obj));
      }

      // Get the type of the object
      var type = obj.GetType();

      // Iterate over all properties of the object
      foreach (var property in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
      {
        // Check if the property is of type DateTime and is writable
        if (property.PropertyType == typeof(DateTime) && property.CanWrite)
        {
          // Get the current value of the property
          var value = (DateTime?)property.GetValue(obj);

          if (value.HasValue)
          {
            // Convert the DateTime to universal time and set it back
            property.SetValue(obj, value.Value.ToUniversalTime());
          }
        }
      }
    }

    public static string RemoveDuplicates(string yearList)
    {
      if (string.IsNullOrWhiteSpace(yearList))
        return string.Empty;

      return string.Join(",", yearList.Split(',').Select(y => y.Trim()).Distinct().OrderBy(y => y)); // Optional sorting
    }

    [HttpGet("init")]
    public async Task<ActionResult> InitApp()
    {
      //_dbContext.StravaUsers.Add(systemUIser);
      //await _dbContext.SaveChangesAsync();


      //var segmentIds = new List<long>(){
      //  1313,
      //  1315,
      //  631703,
      //  637362,
      //  658277,
      //  751029,
      //  813814,
      //  1290381,
      //  12039079,
      //  29015105,
      //  647251,
      //  746977,
      //  2622235,
      //  881465,
      //  694014,
      //  641588,
      //  6639717,
      //  785113,
      //  647488,
      //};


      //for (int i = 0; i < segmentIds.Count; i++)
      //{
      //  var segmentId = segmentIds[i];
      //  var segment = await _stravaService.GetSegment(segmentId);

      //  if (segment == null) return NotFound();

      //  if (_dbContext.Segments.Any(s => s.Id == segmentId))
      //  {
      //    return Conflict("segment exists");
      //  }

      //  _dbContext.Segments.Add(segment);
      //  await _dbContext.SaveChangesAsync();
      //}







      return Ok();
    }

    // PUT: api/TodoItems/5
    // To protect from over posting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    //[HttpPut("{id}")]
    //public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
    //{
    //  if (id != todoItem.Id)
    //  {
    //    return BadRequest();
    //  }

    //  _context.Entry(todoItem).State = EntityState.Modified;

    //  try
    //  {
    //    await _context.SaveChangesAsync();
    //  }
    //  catch (DbUpdateConcurrencyException)
    //  {
    //    if (!TodoItemExists(id))
    //    {
    //      return NotFound();
    //    }
    //    else
    //    {
    //      throw;
    //    }
    //  }

    //  return NoContent();
    //}

    // POST: api/TodoItems
    // To protect from over posting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    //[HttpPost]
    //public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
    //{
    //  if (_context.TodoItems == null)
    //  {
    //    return Problem("Entity set 'TodoContext.TodoItems'  is null.");
    //  }
    //  _context.TodoItems.Add(todoItem);
    //  await _context.SaveChangesAsync();

    //  return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
    //}

    //[HttpPost]
    //public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
    //{
    //  _context.TodoItems.Add(todoItem);
    //  await _context.SaveChangesAsync();

    //  //return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
    //  return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
    //}

    //// DELETE: api/TodoItems/5
    //[HttpDelete("{id}")]
    //public async Task<IActionResult> DeleteTodoItem(long id)
    //{
    //  if (_context.TodoItems == null)
    //  {
    //    return NotFound();
    //  }
    //  var todoItem = await _context.TodoItems.FindAsync(id);
    //  if (todoItem == null)
    //  {
    //    return NotFound();
    //  }

    //  _context.TodoItems.Remove(todoItem);
    //  await _context.SaveChangesAsync();

    //  return NoContent();
    //}

    //private bool TodoItemExists(long id)
    //{
    //  return (_context.TodoItems?.Any(e => e.Id == id)).GetValueOrDefault();
    //}
  }
}


//populate Segment DB
//    var roadSegmentIdsArr = new long[] {658277,1290381,637362,881465,631703,3596686,29015105,
//                                   618305,1313,1315,5106261,12039079,813814,751029,};

//var roadSegmentIds = roadSegmentIdsArr.ToList();

//var gravelSegmentIds = new long[] {746977,
//                                        647251,
//                                        2622235,
//                                        641588 };

// need to manually tweak GetSegment to return road / gravel
//var tasks = gravelSegmentIds.ToList().Select(id => _stravaService.GetSegment(id));
////  tasks.Add(_stravaService.GetSegment(id));


//var t = await Task.WhenAll(tasks);

//_dbContext.AddRange(t);
//await _dbContext.SaveChangesAsync();

//restore DB from JSON


//       String jsonString = new StreamReader("./CSV/parsedData.json")
//         .ReadToEnd();

//       if (jsonString != null)
//       {


//         Console.WriteLine(jsonString);

//         var newData = JsonSerializer.Deserialize<List<Segment>>(jsonString);

//         foreach (var newData in newData)
//         {
//           ConvertDatesToUniversal(newData);
//           _dbContext.Segments.Add(newData);
//         }
//         _dbContext.SaveChanges();
//   return Ok(rates);

// }


//get user of each season:
// DateTime newYears24 = new DateTime(2024, 1, 1, 0, 0, 0).ToUniversalTime();
// var efforts23 = _dbContext
//   .Efforts.Where(x => x.StartDate < newYears24)
//   .GroupBy(x => x.SegmentId)
//   .Select(g => new { SegmentId = g.Key })
//   .ToList();

// DateTime newYears25 = new DateTime(2025, 1, 1, 0, 0, 0).ToUniversalTime();
// var efforts24 = _dbContext
//   .Efforts.Where(x => x.StartDate < newYears25 && x.StartDate > newYears24)
//   .GroupBy(x => x.SegmentId)
//   .Select(g => new { SegmentId = g.Key })
//   .ToList();

// var segments = _dbContext.Segments.ToList();

// foreach (var segment in segments)
// {
//   if (efforts23.Any(x => x.SegmentId == segment.Id))
//   {
//     segment.Years = SbmtUtils.AddYear(segment.Years, "2023");
//   }
//   if (efforts24.Any(x => x.SegmentId == segment.Id))
//   {
//     segment.Years = SbmtUtils.AddYear(segment.Years, "2024");
//   }
//   _dbContext.Update(segment);
// }

// _dbContext.SaveChanges();

// return Ok("It is Done");

//var users25 = _dbContext.StravaUsers.Where(x => x.Years.Contains("2025")).ToList();
//var users24 = _dbContext.StravaUsers.Where(x => x.Years.Contains("2024")).ToList();
//var users23 = _dbContext.StravaUsers.Where(x => x.Years.Contains("2023")).ToList();
