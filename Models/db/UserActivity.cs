using System;

namespace TodoApi.Models.db
{
  public class UserActivity
  {
    public string Id { get; set; }
    public string Type { get; set; }
    public string Value { get; set; }

    public UserActivity(string type, string value)
    {
      Id = Guid.NewGuid().ToString();
      Type = type;
      Value = value;
    }
  }
}
