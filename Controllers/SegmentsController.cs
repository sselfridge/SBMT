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
  public class SegmentsController : ControllerBase
  {
    private readonly sbmtContext _context;
    private IStravaService _stravaService;

    public SegmentsController(sbmtContext context, IStravaService stravaService)
    {
      _context = context;
      _stravaService = stravaService;
    }

    // GET: api/Segments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Segment>>> GetSegments()
    {
      return await _context.Segments.ToListAsync();
    }

    // GET: api/Segments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Segment>> GetSegment(long id)
    {
      var segment = await _context.Segments.FindAsync(id);

      if (segment == null)
      {
        return NotFound();
      }

      return segment;
    }

    // PUT: api/Segments/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutSegment(long id, Segment segment)
    {


      if (id != segment.Id)
      {
        return BadRequest();
      }

      _context.Entry(segment).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!SegmentExists(id))
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

    // POST: api/Segments
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost("{id}")]
    public async Task<ActionResult<Segment>> PostSegment(long id)
    {

      var segment = await _stravaService.GetSegment(id);

      if (segment == null) return NotFound();

      if (SegmentExists(id)) return Conflict("Segment already exists");

      _context.Segments.Add(segment);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetSegment", new { id = segment.Id }, segment);
    }

    // DELETE: api/Segments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSegment(long id)
    {
      var segment = await _context.Segments.FindAsync(id);
      if (segment == null)
      {
        return NotFound();
      }

      _context.Segments.Remove(segment);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool SegmentExists(long id)
    {
      return _context.Segments.Any(e => e.Id == id);
    }
  }
}
