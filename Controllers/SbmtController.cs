using Microsoft.AspNetCore.Mvc;
using TodoApi.Models.db;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoApi.Controllers
{
  [Route("api/")]
  [ApiController]
  public class SbmtController : ControllerBase
  {
    private sbmtContext _dbContext;

    public SbmtController(sbmtContext dbContext)
    {
      _dbContext = dbContext;
    }


    [HttpGet]
    public IEnumerable<string> Get()
    {
      return new string[] { "sbmtLife", "value2" };
    }

    [HttpGet("recentEfforts")]
    [ResponseCache(Duration = 360)]
    public ActionResult<Effort> GetRecentEfforts(int id)
    {

      var efforts = _dbContext.Efforts.OrderByDescending(u => u.CreatedAt).Take(50);


      var data = efforts.Join(_dbContext.StravaUsers,
        effort => effort.AthleteId,
        user => user.AthleteId,
        (effort, user) => new
        {
          id = effort.Id,
          name = $"{user.Firstname} {user.Lastname}",
          athleteId = user.AthleteId,
          avatar = user.Avatar,
          activityId = effort.ActivityId,
          created = effort.CreatedAt,
          elapsedTime = effort.ElapsedTime,
          segmentId = effort.SegmentId,
          startDate = effort.StartDate
        }).Join(_dbContext.Segments,
        effort => effort.segmentId,
          segment => segment.Id,
          (effort, segment) => new
          {
            id = effort.id,
            name = effort.name,
            athleteId = effort.athleteId,
            avatar = effort.avatar,
            activityId = effort.activityId,
            created = effort.created,
            elapsedTime = effort.elapsedTime,
            segmentId = effort.segmentId,
            SegmentName = segment.Name,
            surfaceType = segment.SurfaceType,
            startDate = effort.startDate
          }).ToList();

      return Ok(data);
    }

    [HttpGet("leaderboard")]
    public IActionResult GetLeaderboard()
    {

      var users = _dbContext.StravaUsers.ToList();

      var data = users.Join(_dbContext.Efforts,
        effort => effort.AthleteId,
        user => user.AthleteId,
        (user, effort) => new
        {
          ElapsedTime = effort.ElapsedTime,
          SegmentId = effort.SegmentId,
          AthleteId = effort.AthleteId,


        }).ToList();

      var effortGroup = new Dictionary<int, Dictionary<long, long>>();
      var dict = new Dictionary<long, long>();

      //foreach (var entry in data)
      //{
      //  var segId = entry.SegmentId;
      //  var elapsedTime = entry.ElapsedTime;
      //  var athleteId = entry.AthleteId;

      //  if (dict.ContainsKey(athleteId))
      //  {



      //  } else
      //  {
      //    var newDict = new Dictionary<long, long>();
      //    dict.Add(athleteId, newDict);
      //  }
      //}

      return Ok(data);
    }


    [HttpGet("segment")]
    [ResponseCache(Duration = 3600)]

    public List<Segment> GetSegments()
    {
      var segments = _dbContext.Segments.ToList();

      return segments;
    }

    [HttpGet("segment/{id}")]
    [ResponseCache(Duration = 3600)]

    public IActionResult GetSegment(long id)
    {
      var segment = _dbContext.Segments.FirstOrDefault(s => s.Id == id);

      if (segment == null) return NotFound();

      return Ok(segment);
    }

    [HttpGet("athlete/id")]
    public async Task<IActionResult> GetAthleteIdAsync()
    {

      var possibleNulUser = HttpContext.Items["User"];

      if (possibleNulUser == null)
      {
        return NotFound();

      }

      return Ok(possibleNulUser);
    }

    [HttpDelete("logout")]
    public IActionResult Logout()
    {

      HttpContext.Response.Cookies.Delete("SBMT");


      return Ok("Cookie Deleted");
    }

    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
