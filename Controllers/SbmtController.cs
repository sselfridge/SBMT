using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    private readonly IConfiguration Configuration;


    public SbmtController(sbmtContext dbContext, IUserService userService, IConfiguration configuration)
    {
      _dbContext = dbContext;
      _userService = userService;
      Configuration = configuration;
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
            id = $"{effort.id}",
            name = effort.name,
            athleteId = effort.athleteId,
            avatar = effort.avatar,
            activityId = $"{effort.activityId}",
            created = effort.created,
            elapsedTime = effort.elapsedTime,
            segmentId = $"{effort.segmentId}",
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

      long clubFilter = 0;
      long.TryParse(HttpContext.Request.Query["club"], out clubFilter);



      var allSegment = _dbContext.Segments.ToList();
      if (surfaceFilter != null &&
          (surfaceFilter == "gravel" || surfaceFilter == "road"))
      {
        allSegment = allSegment.FindAll(s => s.SurfaceType == surfaceFilter);
      }

      var users = _dbContext.StravaUsers.Include(x => x.StravaClubs).ToList();

      if (genderFilter != null && (genderFilter == "M" || genderFilter == "F"))
      {
        users = users.FindAll(u => u.Sex == genderFilter);
      }

      if (clubFilter != 0)
      {
        users = users.FindAll(u => u.StravaClubs.Any(club => club.Id == clubFilter));
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
      var segmentCount = allSegment.Count;

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
                                  totalElevation,
                                  segmentCount);

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

    [HttpGet("segments/{segmentId}/leaderboard")]
    [ResponseCache(Duration = 36000)]
    public IActionResult GetSegmentLeaderboard(long segmentId)
    {

      var efforts = _dbContext.Efforts.Where(e => e.SegmentId == segmentId).ToList();

      var bestEfforts = new Dictionary<int, Effort>();

      foreach (var effort in efforts)
      {
        var athleteId = effort.AthleteId;
        if (bestEfforts.ContainsKey(athleteId))
        {
          var bestTime = bestEfforts[athleteId].ElapsedTime;
          if (bestTime > effort.ElapsedTime)
          {
            bestEfforts[athleteId] = effort;
          }
        }
        else
        {
          bestEfforts[athleteId] = effort;
        }
      }

      var bestList = bestEfforts.OrderBy(x => x.Value.ElapsedTime).ToList();


      var data = bestList.Join(_dbContext.StravaUsers,
      effort => effort.Key,
      user => user.AthleteId,
      (effort, user) => new
      {
        id = $"{effort.Value.Id}",
        elapsedTime = effort.Value.ElapsedTime,
        activityId = $"{effort.Value.ActivityId}",
        athleteId = user.AthleteId,
        firstname = user.Firstname,
        lastname = user.Lastname,
        avatar = user.Avatar,

      }).ToList().OrderBy(x => x.elapsedTime);


      return Ok(data);
    }

    [HttpGet("segments/{segmentId}")]
    [ResponseCache(Duration = 36000)]

    public IActionResult GetSegment(long segmentId)
    {
      var segment = _dbContext.Segments.FirstOrDefault(s => s.Id == segmentId);

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
          user.Scope = ""; //Not everyone needs to know everyones scopes
          users.Add(new StravaUserDTO(user));
        }
      }

      return Ok(users);
    }

    [HttpGet("athletes/current")]
    public IActionResult GetCurrentAthlete()
    {
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;

      if (userId == null) return NotFound();

      var athleteId = Int32.Parse(userId);
      var possibleNullUser = _dbContext.StravaUsers
                              .Include(x => x.StravaClubs)
                              .FirstOrDefault(u => u.AthleteId == athleteId);

      if (possibleNullUser == null) return NotFound();

      StravaUser user = (StravaUser)possibleNullUser;

      return Ok(new StravaUserDTO(user));
    }

    [HttpGet("athletes/{id}")]
    [ResponseCache(Duration = 360)]

    public IActionResult GetAthlete(int id)
    {
      var user = _userService.GetById(id);
      if (user == null) return NotFound();
      user.Scope = "";
      return Ok(new StravaUserDTO(user));
    }

    [HttpGet("athletes/{athleteId}/efforts")]
    [ResponseCache(Duration = 3600)]

    public IActionResult GetAthleteEfforts(int athleteId)
    {
      var userSegments = _userService.GetUserEfforts(athleteId);

      if (userSegments == null) return Ok(null);

      var result = userSegments.Select(x => new UserSegmentDTO(x)).ToList();

      return Ok(result);
    }

    [HttpDelete("logout")]
    public IActionResult Logout()
    {

      HttpContext.Response.Cookies.Delete(Configuration["CookieName"]);


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
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;
      if (userId == null) return NotFound();
      var athleteId = Int32.Parse(userId);


      if (id != athleteId) return Unauthorized();


      var dbUser = _dbContext.StravaUsers.FirstOrDefault(u => u.AthleteId == athleteId);
      if (dbUser == null) return NotFound();

      try
      {
        await _userService.DeleteUser(athleteId);

      }
      catch (Exception)
      {

        return BadRequest();
      }

      HttpContext.Response.Cookies.Delete(Configuration["CookieName"]);
      var deletedUserDTO = new StravaUserDTO(dbUser);
      return Ok(deletedUserDTO);
    }
  }
}
