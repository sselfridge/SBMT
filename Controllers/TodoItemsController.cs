using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
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
    private readonly IConfiguration Configuration;


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
    public TodoItemsController(TodoContext context, IUserService userService, sbmtContext dbContext, IConfiguration configuration)
    {
      _context = context;
      _userService = userService;
      _dbContext = dbContext;
      Configuration = configuration;
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
    public async Task<ActionResult<TodoItem>> TestThing()
    {



      var students = _dbContext.Students.ToList();

      var newStudent = new Student();
      newStudent.Name = "Bobby";
      newStudent.Age = 34;
      newStudent.Grade = 10;

      _dbContext.Students.Add(newStudent);
      _dbContext.SaveChanges();
      var newCookie = GenerateJwtToken(1234);

      var possibleNulUser = HttpContext.Items["User"];

      if (possibleNulUser == null)
      {
        return Ok("Hello Null User");

      }
      StravaUser user = (StravaUser)possibleNulUser;


      var id = user.AthleteId;

      var cookie = GenerateJwtToken(id);
      HttpContext.Response.Cookies.Append("SBMT", cookie);
      return Ok("Hello there, cookie set");

    }





    [HttpPost("strava")]
    public async Task<IActionResult> pushPost()
    {
      Stream req = Request.Body;
      var json = await new StreamReader(req).ReadToEndAsync();
      StravaPushNotificationDTO? subRes = JsonSerializer.Deserialize<StravaPushNotificationDTO>(json);
      if (subRes != null)
      {
        var pushNotification = new StravaPushNotification(subRes);
        //var updates = JsonSerializer.Deserialize<JsonObject>(pushNotification.Updates);
        _dbContext.StravaPushNotifications.Add(pushNotification);
        _dbContext.SaveChanges();
        return Ok("Created");

      }
      return Ok();

    }


    // PUT: api/TodoItems/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
    {
      if (id != todoItem.Id)
      {
        return BadRequest();
      }

      _context.Entry(todoItem).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!TodoItemExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

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

    [HttpPost]
    public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
    {
      _context.TodoItems.Add(todoItem);
      await _context.SaveChangesAsync();

      //return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
      return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
    }

    // DELETE: api/TodoItems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(long id)
    {
      if (_context.TodoItems == null)
      {
        return NotFound();
      }
      var todoItem = await _context.TodoItems.FindAsync(id);
      if (todoItem == null)
      {
        return NotFound();
      }

      _context.TodoItems.Remove(todoItem);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool TodoItemExists(long id)
    {
      return (_context.TodoItems?.Any(e => e.Id == id)).GetValueOrDefault();
    }
  }
}
