﻿using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
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

      //Effortgroup contains key of athleteID and value of a dict with <segId, EffortTime>
      var effortGroup = new Dictionary<int, Dictionary<long, int>>();

      foreach (var entry in data)
      {
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

        foreach (KeyValuePair<long, int> effort in efforts)
        {
          totalTime = totalTime + effort.Value;
        }

        var user = users.FirstOrDefault(u => u.AthleteId == athleteId);
        if (user != null)
        {
          var athleteName = $"{user.Firstname} {user.Lastname}";
          var leaderboardEntry = new LeaderboardEntry(athleteId, athleteName, user.Avatar, completed, totalTime);

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
    public IActionResult GetAthleteId()
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
