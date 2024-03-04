using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
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
      var users = await _context.StravaUsers.ToListAsync();
      return Ok(users);
    }

    // PUT: api/users/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{athleteId}")]
    public async Task<IActionResult> PutSegment(int athleteId, StravaUser user)
    {
      if (athleteId != user.AthleteId)
      {
        return BadRequest();
      }

      _context.Entry(user).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!UsersExists(athleteId))
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

    [HttpPatch()]
    public async Task<IActionResult> PatchSegment([FromBody] List<JsonElement> patch)
    {

      var errors = new List<string>();

      for (var i = 0; i < patch.Count; i++)
      {
        var obj = patch[i];
        var patchObject = JsonSerializer.Deserialize<Dictionary<string, object>>(obj.GetRawText());

        if (patchObject == null)
        {
          errors.Add("Null Object");
          continue;
        }

        if (patchObject["athleteId"] == null)
        {
          errors.Add("Missing athleteId");
          continue;
        }

        var athId = patchObject["athleteId"].ToString();
        if (athId == null)
        {
          errors.Add("Invalid athleteId");
          continue;
        }
        var atheleteId = Int32.Parse(athId);
        var user = _context.StravaUsers.FirstOrDefault(x => x.AthleteId == atheleteId);

        if (user == null)
        {
          errors.Add("Invalid user");
          continue;
        }

        foreach (var kvp in patchObject)
        {
          var propertyName = kvp.Key;
          var PropertyName = propertyName.Substring(0, 1).ToUpper() + propertyName.Substring(1);
          var newValue = kvp.Value.ToString();

          if (propertyName == "athleteId")
          {
            continue;
          }


          // Check if the property exists in the model
          var propertyToUpdate = user.GetType().GetProperty(PropertyName);
          var uType = user.GetType();
          var propUP = uType.GetProperty(PropertyName);


          if (propertyToUpdate != null)
          {
            // Convert the new value to the correct type and set it
            var convertedValue = Convert.ChangeType(newValue, propertyToUpdate.PropertyType);
            propertyToUpdate.SetValue(user, convertedValue);

            Console.WriteLine();


          }
        }

        _context.Update(user);

      }


      await _context.SaveChangesAsync();


      return NoContent();
    }

    private bool UsersExists(int athleteId)
    {
      return _context.StravaUsers.Any(e => e.AthleteId == athleteId);
    }
  }
}
