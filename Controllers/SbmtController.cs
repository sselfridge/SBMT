using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoApi.Controllers
{
  [Route("api/")]
  [ApiController]
  public class SbmtController : ControllerBase
  {
    private sbmtContext _dbContext;
    private IUserService _userService;

    public SbmtController(sbmtContext dbContext, IUserService userService)
    {
      _dbContext = dbContext;
      _userService = userService;
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
    [ResponseCache(Duration = 3600)]

    public IActionResult GetLeaderboard()
    {

      string surfaceFilter = HttpContext.Request.Query["surface"];
      string genderFilter = HttpContext.Request.Query["gender"];

      var allSegment = _dbContext.Segments.ToList();
      if (surfaceFilter != null &&
          (surfaceFilter == "gravel" || surfaceFilter == "road"))
      {
        allSegment = allSegment.FindAll(s => s.SurfaceType == surfaceFilter);
      }

      var users = _dbContext.StravaUsers.ToList();

      if (genderFilter != null && (genderFilter == "M" || genderFilter == "F"))
      {
        users = users.FindAll(u => u.Sex == genderFilter);
      }


      var data = users.Join(_dbContext.Efforts,
        effort => effort.AthleteId,
        user => user.AthleteId,
        (user, effort) =>
        {
          if (allSegment.Find(s => s.Id == effort.SegmentId) != null)
          {
            return new
            {
              ElapsedTime = effort.ElapsedTime,
              SegmentId = effort.SegmentId,
              AthleteId = effort.AthleteId,
              Sex = user.Sex
            };
          }
          return null;
        }).ToList();





      //Effortgroup contains key of athleteID and value of a dict with <segId, EffortTime>
      var effortGroup = new Dictionary<int, Dictionary<long, int>>();

      foreach (var entry in data)
      {
        if (entry == null) continue;
        var segId = entry.SegmentId;
        var elapsedTime = entry.ElapsedTime;
        var athleteId = entry.AthleteId;

        if (effortGroup.ContainsKey(athleteId))
        {
          var segments = effortGroup[athleteId];

          if (segments.ContainsKey(segId))
          {
            if (segments[segId] < elapsedTime)
            {
              segments[segId] = elapsedTime;
            }
          }
          else
          {
            segments[segId] = elapsedTime;
          }
        }
        else
        {
          var segments = new Dictionary<long, int> { [segId] = elapsedTime };
          effortGroup.Add(athleteId, segments);
        }
      }

      var leaderboard = new List<LeaderboardEntry>();

      foreach (KeyValuePair<int, Dictionary<long, int>> entry in effortGroup)
      {
        var athleteId = entry.Key;
        var efforts = entry.Value;

        int completed = efforts.Count();
        int totalTime = 0;
        double totalDistance = 0;
        double totalElevation = 0;

        foreach (KeyValuePair<long, int> effort in efforts)
        {
          totalTime = totalTime + effort.Value;
          var seg = allSegment.Find(s => s.Id == effort.Key);
          if (seg != null)
          {
            totalDistance = totalDistance + seg.Distance;
            totalElevation = totalElevation + seg.TotalElevationGain;
          }
        }

        var user = users.FirstOrDefault(u => u.AthleteId == athleteId);
        if (user != null)
        {
          var athleteName = $"{user.Firstname} {user.Lastname}";
          var leaderboardEntry =
            new LeaderboardEntry(
                                  athleteId,
                                  athleteName,
                                  user.Avatar,
                                  completed,
                                  totalTime,
                                  totalDistance,
                                  totalElevation);

          leaderboard.Add(leaderboardEntry);
        }

      }

      leaderboard.Sort((a, b) =>
      {
        if (a.Completed > b.Completed) { return -1; }

        else if (a.Completed < b.Completed) { return 1; }
        else
        {
          if (a.TotalTime < b.TotalTime) { return -1; }
          else { return 1; }
        }
      });

      for (var i = 0; i < leaderboard.Count; i++)
      {
        var leaderboardEntry = leaderboard[i];
        leaderboardEntry.rank = i + 1;
      }

      return Ok(leaderboard);
    }


    [HttpGet("segments")]
    [ResponseCache(Duration = 36000)]

    public List<Segment> GetSegments()
    {
      var segments = _dbContext.Segments.ToList();

      return segments;
    }

    [HttpGet("segments/{id}")]
    [ResponseCache(Duration = 36000)]

    public IActionResult GetSegment(long id)
    {
      var segment = _dbContext.Segments.FirstOrDefault(s => s.Id == id);

      if (segment == null) return NotFound();

      return Ok(segment);
    }

    [HttpGet("athletes")]
    [ResponseCache(Duration = 360)]

    public IActionResult GetAllAthletes()
    {
      var dbUsers = _dbContext.StravaUsers.ToList();

      var users = new List<StravaUserDTO>();

      foreach (StravaUser user in dbUsers)
      {
        if (user.AthleteId != 1)
        {
          users.Add(new StravaUserDTO(user));
        }
      }

      return Ok(users);
    }

    [HttpGet("athletes/current")]
    public IActionResult GetCurrentAthlete()
    {

      var possibleNulUser = HttpContext.Items["User"];

      if (possibleNulUser == null)
      {
        return NotFound();
      }

      return Ok(possibleNulUser);
    }

    [HttpGet("athletes/{id}")]
    [ResponseCache(Duration = 360)]

    public IActionResult GetAthlete(int id)
    {
      var user = _userService.GetById(id);
      if (user == null) return NotFound();
      return Ok(new StravaUserDTO(user));
    }

    [HttpGet("athletes/{id}/efforts")]
    [ResponseCache(Duration = 3600)]

    public IActionResult GetAthleteEfforts(int id)
    {
      var result = _userService.GetUserEfforts(id);
      return Ok(result);
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

    [HttpDelete("athletes/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var cookieUser = HttpContext.Items["User"];

      if (cookieUser == null) return NotFound();

      StravaUser user = (StravaUser)cookieUser;

      if (id != user.AthleteId) return Unauthorized();

      var allEfforts = _dbContext.Efforts.Where(e => e.AthleteId == user.AthleteId).ToList();

      var dbUser = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == user.AthleteId);
      if (dbUser == null) return NotFound();
      try
      {
        _dbContext.RemoveRange(allEfforts);
        _dbContext.Remove(dbUser);
        HttpContext.Response.Cookies.Delete("SBMT");

        await _dbContext.SaveChangesAsync();

      }
      catch (Exception)
      {

        return BadRequest();
      }


      return Ok(user);
    }
  }
}
