using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
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

      var feedbacks = _context.Feedback.ToList();

      var users = _context.StravaUsers.ToList();

      var data = new List<FeedbackDTO>();

      foreach (var feedback in feedbacks)
      {
        var athleteId = feedback.AthleteId;
        var user = users.Find(u => u.AthleteId == athleteId);

        if (user == null)
        {
          var newFeedback = new FeedbackDTO(feedback);
          data.Add(newFeedback);
        }
        else
        {
          var newFeedback = new FeedbackDTO(feedback, user);
          data.Add(newFeedback);
        }
      }


      return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFeedback(string id)
    {

      var feedback = await _context.Feedback.FindAsync(id);
      if (feedback == null)
      {
        return NotFound();
      }

      _context.Feedback.Remove(feedback);
      await _context.SaveChangesAsync();

      return NoContent();
    }
  }
}
