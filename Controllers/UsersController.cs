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
      return await _context.StravaUsers.ToListAsync();
    }


  }
}
