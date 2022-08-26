
using System.ComponentModel.DataAnnotations;
using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db

{
  public class StravaUser
  {
    [Key]
    public int AthleteId { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Avatar { get; set; }
    public DateTime JoinDate { get; set; }

    public StravaUser(int athleteId, string firstname, string lastname, string avatar)
    {
      AthleteId = athleteId;
      Firstname = firstname;
      Lastname = lastname;
      Avatar = avatar;
      JoinDate = DateTime.UtcNow;
    }

    public StravaUser(StravaAthlete athlete)
    {
      Firstname = athlete.Firstname;
      Lastname = athlete.Lastname;
      Avatar = athlete.ProfileMedium;
      AthleteId = athlete.Id;
      JoinDate = DateTime.UtcNow;

    }

  }
}
