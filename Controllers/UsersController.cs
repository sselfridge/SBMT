using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models.db;
using TodoApi.Services;


namespace TodoApi.Controllers
{
  [Route("api/admin/[controller]")]
  [ApiController]
  [Authorize(Policy = "UserIsAdminPolicy")]
  public class UsersController : ControllerBase
  {
    private readonly sbmtContext _context;
    private IStravaService _stravaService;

    public UsersController(sbmtContext context, IStravaService stravaService)
    {
      _context = context;
      _stravaService = stravaService;
    }

    // GET: api/Segments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StravaUser>>> GetUsers()
    {
      var users = await _context.StravaUsers.ToListAsync();
      return Ok(users);
    }

    // PUT: api/users/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{athleteId}")]
    public async Task<IActionResult> PutSegment(int athleteId, StravaUser user)
    {
      if (athleteId != user.AthleteId)
      {
        return BadRequest();
      }

      _context.Entry(user).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!UsersExists(athleteId))
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

    private bool UsersExists(int athleteId)
    {
      return _context.StravaUsers.Any(e => e.AthleteId == athleteId);
    }
  }
}
