﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;
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
    ////[ResponseCache(Duration = 360)]
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
    ////[ResponseCache(Duration = 3600)]

    public IActionResult GetLeaderboard()
    {

      string surfaceFilter = HttpContext.Request.Query["surface"];
      string genderFilter = HttpContext.Request.Query["gender"];

      string categoryFilter = HttpContext.Request.Query["category"];

      string ageFilter = HttpContext.Request.Query["age"];

      int lowerAge = -1;
      int upperAge = 101;
      if (ageFilter != null)
      {
        Regex under = new Regex(@"(\d+).*under", RegexOptions.IgnoreCase);
        Regex range = new Regex(@"(\d+) to (\d+)", RegexOptions.IgnoreCase);
        Regex over = new Regex(@"(\d+).*over", RegexOptions.IgnoreCase);
        //var o = over.Match(overStr);
        var rangeMatch = range.Match(ageFilter);
        var underMatch = under.Match(ageFilter);
        var overMatch = over.Match(ageFilter);

        if (rangeMatch.Success)
        {
          int.TryParse(rangeMatch.Groups[1].Value, out lowerAge);
          int.TryParse(rangeMatch.Groups[2].Value, out upperAge);
        }
        else if (underMatch.Success)
        {
          int.TryParse(underMatch.Groups[1].Value, out upperAge);

        }
        else if (overMatch.Success)
        {
          int.TryParse(overMatch.Groups[1].Value, out lowerAge);
        }
      }
      long clubFilter = 0;
      long.TryParse(HttpContext.Request.Query["club"], out clubFilter);

      string disStr = HttpContext.Request.Query["distance"];
      long distanceFilter = 0;
      if (disStr != null)
      {
        long.TryParse(string.Join("", new Regex(@"\d+").Matches(disStr)), out distanceFilter);
      }

      string elevStr = HttpContext.Request.Query["elevation"];
      long elevationFilter = 0;
      if (elevStr != null)
      {
        long.TryParse(string.Join("", new Regex(@"\d+").Matches(elevStr)), out elevationFilter);
      }

      var allSegment = _dbContext.Segments.ToList();

      if (surfaceFilter != null &&
          (surfaceFilter == "gravel" || surfaceFilter == "road"))
      {
        allSegment = allSegment.FindAll(s => s.SurfaceType == surfaceFilter);
      }

      var users = _dbContext.StravaUsers.Include(x => x.StravaClubs).ToList();


      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;
      StravaUser? currentUser = null;
      if (userId != null)
      {
        var currId = Int32.Parse(userId);

        currentUser = users.Find(u => u.AthleteId == currId);
      }

      if (genderFilter != null && (genderFilter == "M" || genderFilter == "F"))
      {
        users = users.FindAll(u => u.Sex == genderFilter);
      }

      if (clubFilter != 0)
      {
        users = users.FindAll(u => u.StravaClubs.Any(club => club.Id == clubFilter));
      }

      if (categoryFilter != null)
      {
        users = users.FindAll(u => u.Category == categoryFilter);
      }

      if (lowerAge != -1 || upperAge != 101)
      {
        users = users.FindAll(u => u.Age <= upperAge && u.Age >= lowerAge);
      }

      if (distanceFilter != 0 && currentUser != null)
      {
        users = users.FindAll(u =>
        {
          var userMiles = u.RecentDistance;// * 0.000621371;
          var currMiles = currentUser.RecentDistance;// * 0.000621371;
          var diff = userMiles - currMiles;
          return Math.Abs(diff) <= distanceFilter;
        });
      }

      if (elevationFilter != 0 && currentUser != null)
      {
        users = users.FindAll(u =>
        {
          var userFt = u.RecentElevation;// * 3.28084;
          var currFt = currentUser.RecentElevation;// * 3.28084;
          var diff = userFt - currFt;
          return Math.Abs(diff) <= elevationFilter * 1000;
        });
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
            if (segments[segId] > elapsedTime)
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
                                  user.RecentDistance,
                                  user.RecentElevation,
                                  user.Category,
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

    [HttpPost("saveFilters")]
    public IActionResult saveFilters([FromBody] Filters filters)
    {
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;
      if (userId == null) return Unauthorized();
      var cookieAthleteId = Int32.Parse(userId);

      var strFilters = JsonSerializer.Serialize(filters);

      var user = _dbContext.StravaUsers.FirstOrDefault(x => x.AthleteId == cookieAthleteId);
      if (user == null) return NotFound();

      user.SavedFilters = strFilters;
      _dbContext.SaveChanges();

      return Ok(user);
    }


    [HttpGet("segments")]
    //[ResponseCache(Duration = 36000)]

    public List<Segment> GetSegments()
    {
      var segments = _dbContext.Segments.ToList();

      return segments;
    }

    [HttpGet("segments/{segmentId}/leaderboard")]
    //[ResponseCache(Duration = 36000)]
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
    //[ResponseCache(Duration = 36000)]

    public IActionResult GetSegment(long segmentId)
    {
      var segment = _dbContext.Segments.FirstOrDefault(s => s.Id == segmentId);

      if (segment == null) return NotFound();

      return Ok(segment);
    }

    [HttpGet("athletes")]
    //[ResponseCache(Duration = 360)]

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

      //remove users from clubs (more data leaks)
      foreach (var club in user.StravaClubs)
      {
        club.StravaUsers = new List<StravaUser>();
      }

      return Ok(new StravaUserDTO(user));
    }

    [HttpPost("athletes/current")]
    public async Task<IActionResult> UpdateCurrentAthleteAsync([FromBody] StravaUserDTO newUser)
    {
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;

      if (userId == null) return NotFound();

      var athleteId = Int32.Parse(userId);
      var dbUser = _dbContext.StravaUsers
                              .Include(x => x.StravaClubs)
                              .FirstOrDefault(u => u.AthleteId == athleteId);

      if (dbUser == null) return NotFound();

      if (dbUser.AthleteId != newUser.AthleteId) return Unauthorized();

      dbUser.Age = newUser.Age;
      dbUser.Category = newUser.Category;
      _dbContext.Update(dbUser);
      await _dbContext.SaveChangesAsync();


      return Ok(newUser);
    }

    [HttpGet("athletes/{id}")]
    //[ResponseCache(Duration = 360)]

    public IActionResult GetAthlete(int id)
    {
      var user = _userService.GetById(id);
      if (user == null) return NotFound();
      user.Scope = "";
      return Ok(new StravaUserDTO(user));
    }

    [HttpGet("athletes/{athleteId}/efforts")]
    //[ResponseCache(Duration = 3600)]

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

    [HttpPost("feedback")]
    public IActionResult SubmitFeedback([FromBody] Feedback feedback)
    {
      Console.WriteLine(feedback);
      var userId = HttpContext.User.FindFirst("AthleteId")?.Value;
      if (userId != null)
      {
        var athleteId = Int32.Parse(userId);
        feedback.AthleteId = athleteId;
      }

      _dbContext.Feedback.Add(feedback);
      _dbContext.SaveChanges();


      return Ok();
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
