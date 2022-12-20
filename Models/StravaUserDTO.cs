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
    }

  }


}
