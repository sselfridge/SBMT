using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class Admin_api_read_write : ControllerBase
  {
    // GET: api/<Admin_api_read_write>
    [HttpGet]
    public IEnumerable<string> Get()
    {
      return new string[] { "value1", "value2" };
    }

    // GET api/<Admin_api_read_write>/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
      return "value";
    }

    // POST api/<Admin_api_read_write>
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/<Admin_api_read_write>/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/<Admin_api_read_write>/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
