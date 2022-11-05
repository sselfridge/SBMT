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
    public TodoItemsController(TodoContext context,
      IUserService userService, IStravaService stravaService,
      sbmtContext dbContext, IConfiguration configuration, StravaLimitService stravaLimitService)
    {
      _context = context;
      _userService = userService;
      _stravaService = stravaService;
      _dbContext = dbContext;
      Configuration = configuration;
      RateLimits = stravaLimitService;
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
    public async Task<ActionResult<TodoItem>> TestThing([FromServices] IServiceScopeFactory serviceScopeFactory)
    {
      if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
      {
        return Ok("loadked");
      }

      return Ok("loadked");


      var glennAnnieEfforts = new List<Effort>();
      var count = 0;

      var list = new List<long>() { 27851109 };


      var users = _dbContext.StravaUsers.ToList();

      foreach (var user in users)
      {
        if (user == null || user.AthleteId == 1) continue;

        var actvities = await _stravaService.GetActivities(user.AthleteId, _dbContext);

        foreach (var act in actvities)
        {
          var client = await _stravaService.GetClientForUser(user.AthleteId);
          var fullActivity = await _stravaService.GetActivity(act.Id, client);
          var efforts = StravaUtilities.PullEffortsFromActivity(fullActivity, list);
          if (efforts != null) { glennAnnieEfforts.AddRange(efforts); }
          count++;
        }


      }
      Console.WriteLine($"Total Activites:{count}");
      return Ok(glennAnnieEfforts);

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

      //var possibleNulUser = HttpContext.Items["User"];

      //if (possibleNulUser == null)
      //{
      //  return Ok("Hello Null User");

      //}
      //StravaUser user = (StravaUser)possibleNulUser;


      //var id = user.AthleteId;

      //var cookie = GenerateJwtToken(id);
      //HttpContext.Response.Cookies.Append("SBMT", cookie);
      //return Ok("Hello there, cookie set");

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
