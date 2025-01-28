using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Helpers;
using TodoApi.Models.db;
using TodoApi.Services;

namespace TodoApi.Controllers
{
  [Route("api/admin/[controller]")]
  [ApiController]
  [Authorize(Policy = "UserIsAdminPolicy")]
  public class EffortsController : ControllerBase
  {
    private readonly sbmtContext _context;
    private IStravaService _stravaService;

    public EffortsController(sbmtContext context, IStravaService stravaService)
    {
      _context = context;
      _stravaService = stravaService;
    }

    // GET: api/Efforts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Effort>>> GetEfforts()
    {
      var kickOffDate = SbmtUtils.getKickOffDate();

      return await _context.Efforts.Where(x => x.StartDate > kickOffDate).ToListAsync();
    }

    // GET: api/Efforts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Effort>> GetEffort(long id)
    {
      var effort = await _context.Efforts.FindAsync(id);

      if (effort == null)
      {
        return NotFound();
      }

      return effort;
    }

    // PUT: api/Efforts/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut]
    public async Task<IActionResult> PutEffort(NewEffortDTO newEffort)
    {
      Console.WriteLine("New Effort Recieved");

      var effort = new Effort(newEffort);

      //TODO - add validation for newEffort values

      _context.Efforts.Add(effort);
      await _context.SaveChangesAsync();

      return Ok(effort);
    }

    //POST: api/Efforts
    //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost("{id}")]
    public async Task<ActionResult<Effort>> PostEffort(long id, Effort effort)
    {
      if (effort == null)
        return NotFound();

      var lastManual = _context
        .Efforts.Where(e => e.ManualEffort == true)
        .OrderByDescending(e => e.Id)
        .FirstOrDefault();

      long newId = 0;

      if (lastManual == null)
      {
        newId = 100;
      }
      else
      {
        newId = lastManual.Id + 1;
      }

      if (EffortExists(id))
        return Conflict("Effort already exists");

      _context.Efforts.Add(effort);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetEffort", new { id = effort.Id }, effort);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> AddRankToNew(long id)
    {
      var effort = await _context.Efforts.FindAsync(id);
      if (effort == null)
      {
        return NotFound();
      }

      //update rank for effort - copied from StravaUtilities.parseNew
      var needToUpdate = false;

      var kickOffDate = SbmtUtils.getKickOffDate();

      var top10 = _context
        .Efforts.Where(e => e.SegmentId == effort.SegmentId && e.StartDate > kickOffDate)
        .GroupBy(
          e => e.AthleteId,
          e => new { e.ElapsedTime, e.Id },
          (baseKey, times) =>
            new
            {
              Key = baseKey, //AthleteId (not used)
              Time = times
                .Where(x => x.ElapsedTime == times.Min(x => x.ElapsedTime))
                .Select(x => x.ElapsedTime)
                .First(),
              Id = times
                .Where(x => x.ElapsedTime == times.Min(x => x.ElapsedTime))
                .Select(x => x.Id)
                .First(),
            }
        )
        .OrderBy(x => x.Time)
        .Take(10)
        .ToList();

      var index = top10.FindIndex(e => e.Id == effort.Id);
      if (index != -1)
      {
        var dbEffort = _context.Efforts.Where(e => e.Id == top10[index].Id).FirstOrDefault();
        if (dbEffort != null)
        {
          dbEffort.Rank = index + 1;
          _context.Update(dbEffort);
          needToUpdate = true;
        }
      }

      if (needToUpdate)
      {
        _context.SaveChanges();
      }

      return Ok($"Updated:{needToUpdate}");
    }

    // DELETE: api/Efforts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEffort(long id)
    {
      var effort = await _context.Efforts.FindAsync(id);
      if (effort == null)
      {
        return NotFound();
      }

      _context.Efforts.Remove(effort);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool EffortExists(long id)
    {
      return _context.Efforts.Any(e => e.Id == id);
    }
  }
}
