using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TodoApi.Helpers;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Services;


namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TodoItemsController : ControllerBase
  {
    private readonly TodoContext _context;
    private sbmtContext _dbContext;
    private IUserService _userService;
    private IStravaService _stravaService;
    private readonly IConfiguration Configuration;
    private StravaLimitService RateLimits;
    private IServiceScopeFactory _serviceScopeFactory;


    private string GenerateJwtToken(int id)
    {
      // generate token that is valid for 30 days
      var tokenHandler = new JwtSecurityTokenHandler();
      var jwtKey = Configuration["jwtKey"];

      var key = Encoding.ASCII.GetBytes(jwtKey);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new[] { new Claim("id", id.ToString()) }),
        Expires = DateTime.UtcNow.AddDays(300),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
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
          var actvities = await _stravaService.GetActivities(user.AthleteId);
          var newEfforts = new List<Effort>();
          foreach (var act in actvities)
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


      var users = _dbContext.StravaUsers.ToList();
      var realUsers = new List<StravaUser>();

      foreach (var user in users)
      {
        if (user == null || user.AthleteId == 1) continue;
        // for 504 activites was ~7min
        // 40.81 - running in parellel no DB calls
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


      Console.WriteLine($"Total Activites:{count}");
      return newSegmentEfforts;
    }

    public TodoItemsController(TodoContext context,
      IUserService userService, IStravaService stravaService,
      sbmtContext dbContext, IConfiguration configuration,
      StravaLimitService stravaLimitService, IServiceScopeFactory serviceScopeFactory)
    {
      _context = context;
      _userService = userService;
      _stravaService = stravaService;
      _dbContext = dbContext;
      Configuration = configuration;
      RateLimits = stravaLimitService;
      _serviceScopeFactory = serviceScopeFactory;
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

    // GET: api/TodoItems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
    {
      return NotFound();
      if (_context.TodoItems == null)
      {
        return NotFound();
      }
      var todoItem = await _context.TodoItems.FindAsync(id);

      if (todoItem == null)
      {
        return NotFound();
      }

      return todoItem;
    }

    [HttpGet()]
    public async Task<ActionResult<long>> TestThing([FromServices] IServiceScopeFactory serviceScopeFactory)
    {

      var count = _dbContext.StravaUsers.Count();
      Console.WriteLine($"sbmtLog {count} users in DB");


      if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
      {
        return Ok("loadked");
      }

      //return Ok("Standing by...");


      //var stats = await _stravaService.GetAthleteStats(201227);

      var user = _dbContext.StravaUsers.FirstOrDefault(x => x.AthleteId == 1075670);



      var updated = await _stravaService.UpdateUserStats(user);


      //return Ok(updated);

      return Ok("Ready to go");


      var newStudent = new Student();
      newStudent.Name = "Bobby";
      newStudent.Age = 34;
      newStudent.Grade = 10;

      _dbContext.Students.Add(newStudent);
      _dbContext.SaveChanges();
      var newCookie = GenerateJwtToken(1234);

      var fifteen = RateLimits.GetUsage15();
      var daily = RateLimits.GetUsageDaily();

      int[] result = new int[] { fifteen, daily };


      //var activity = await _stravaService.GetActivity(6156488864, 1075670);
      //var result = await _stravaService.GetProfile(1075670, _dbContext);
      //var efforts = StravaUtilities.PullEffortsFromActivity(activity);
      //Array.ForEach(efforts, (effort) =>
      //{
      //  var effortExists = _dbContext.Efforts.Any(e => e.Id == effort.Id);
      //  if (effortExists == false)
      //  {
      //    _dbContext.Add(effort);
      //  }
      //});

      //_dbContext.SaveChanges();
      //await StravaUtilities.KickOffInitialFetch(serviceScopeFactory);
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      //Task.Run(async () =>
      //{

      //  using (var scope = serviceScopeFactory.CreateScope())
      //  {
      //    var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
      //    var activities = await _stravaService.GetActivities(1075670, context);

      //    var newStudent = new Student();
      //    newStudent.Name = "WAIT FOR ME!!!!";
      //    newStudent.Age = 20;
      //    newStudent.Grade = 10;

      //    context.Students.Add(newStudent);
      //    await context.SaveChangesAsync();
      //  }
      //});
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

      //var seg = _dbContext.Segments.FirstOrDefault(s => s.Id == 746977);
      //var seg = _dbContext.Segments.ToList();


      return Ok(result);



    }


    [HttpGet("init")]
    public async Task<ActionResult> InitApp()
    {
      //var systemUIser = new StravaUser(1,
      //  "App",
      //  "Root",
      //  "https://dgalywyr863hv.cloudfront.net/pictures/athletes/10645041/16052758/1/medium.jpg",
      //  1669890293,
      //  "de9e59f05d5e69aca8bbfd9bc29b279080e15347",
      //  "7aa35e2d132e10e664b7edf4e8742187cb9bf079",
      //  "M",
      //  0.0,
      //  "allScope");

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
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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
