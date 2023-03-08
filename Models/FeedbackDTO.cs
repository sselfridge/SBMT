using TodoApi.Models.db;

namespace TodoApi.Models
{
  public class FeedbackDTO
  {
    public string Id { get; set; }
    public int AthleteId { get; set; }
    public string Name { get; set; }
    public string Avatar { get; set; }
    public string Text { get; set; }


    public FeedbackDTO(Feedback feedback, StravaUser user)
    {
      Id = feedback.Id;
      Text = feedback.Text;
      AthleteId = user.AthleteId;
      Avatar = user.Avatar;
      Name = $"{user.Firstname} {user.Lastname}";
    }
    public FeedbackDTO(Feedback feedback)
    {
      Id = feedback.Id;
      Text = feedback.Text;
      AthleteId = 0;
      Avatar = "";
      Name = "";
    }

  }


}
