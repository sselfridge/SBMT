using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Services;


namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StravaController : ControllerBase
  {
    private readonly StravaOAuthContext _context;

    public StravaController(StravaOAuthContext context)
    {
      _context = context; 
    }

    // GET: api/TodoItems
    [HttpGet("callback")]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetStravaCallback(string code,string scope)
    {
      //  create put requester
      //TODO: Create response obj
      // make basic FE app to be redirected to strava oauth
      var oAuth = await StravaServices.GetTokens(code);

      _context.StravaOAuths.Add(oAuth);
      await _context.SaveChangesAsync();



      return Redirect("http://localhost:3000");     
    }

    [HttpGet]
    public async void GetAuths()
    {
      if (_context.StravaOAuths == null)
      {
        NotFound();
      }
      var oauths =  await _context.StravaOAuths.ToListAsync();


      Console.Write("Fin");
    }

  }
}
