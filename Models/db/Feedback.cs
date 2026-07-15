using System;

namespace TodoApi.Models.db
{
  public class Feedback
  {
    public string Id { get; set; }
    public int AthleteId { get; set; }
    public string Text { get; set; }
    public bool Read { get; set; } = false;
    public DateTime CreatedDate { get; set; }

    public Feedback(string text)
    {
      Id = Guid.NewGuid().ToString();
      AthleteId = 0;
      Text = text;
      CreatedDate = DateTime.UtcNow;
    }
  }
}
