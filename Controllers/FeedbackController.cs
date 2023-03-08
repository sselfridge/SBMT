using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models.db;
using TodoApi.Services;


namespace TodoApi.Controllers
{
  [Route("api/admin/[controller]")]
  [ApiController]
  [Authorize(Policy = "UserIsAdminPolicy")]
  public class FeedbackController : ControllerBase
  {
    private readonly sbmtContext _context;
    private IStravaService _stravaService;

    public FeedbackController(sbmtContext context, IStravaService stravaService)
    {
      _context = context;
      _stravaService = stravaService;
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Feedback>>> GetUsers()
    {
      //return await _context.Feedback.ToListAsync();

      var feedbacks = _context.Feedback;

      var data = feedbacks.Join(_context.StravaUsers,
        feedback => feedback.AthleteId,
        user => user.AthleteId,
        (feedback, user) => new
        {
          id = feedback.Id,
          name = $"{user.Firstname} {user.Lastname}",
          athleteId = user.AthleteId,
          avatar = user.Avatar,
          text = feedback.Text,

        });

      return Ok(data);
    }


  }
}
