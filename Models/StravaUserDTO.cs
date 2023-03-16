using System.Text.Json.Serialization;
using TodoApi.Models.db;

namespace TodoApi.Models
{
  public class StravaUserDTO
  {
    public int AthleteId { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Avatar { get; set; }
    public DateTime JoinDate { get; set; }
    public string Sex { get; set; }
    public double Weight { get; set; }
    public string Scope { get; set; }
    public ICollection<StravaClub> StravaClubs { get; set; }
    public int Age { get; set; }
    public string Category { get; set; }
    public double RecentDistance { get; set; }
    public double RecentElevation { get; set; }

    [JsonConstructor]
    public StravaUserDTO() { }

    public StravaUserDTO(StravaUser user)
    {
      AthleteId = user.AthleteId;
      Firstname = user.Firstname;
      Lastname = user.Lastname;
      Avatar = user.Avatar;
      JoinDate = user.JoinDate;
      Sex = user.Sex;
      Weight = user.Weight;
      Scope = user.Scope;
      StravaClubs = user.StravaClubs;
      Age = user.Age;
      Category = user.Category;
      RecentDistance = user.RecentDistance;
      RecentElevation = user.RecentElevation;
    }

  }


}
