using System.Text.Json;
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
    public Filters? SavedFilters { get; set; }
    public bool Active { get; set; }

    [JsonConstructor]
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
    public StravaUserDTO() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

    public StravaUserDTO(StravaUser user)
    {
      var userFilters = new Filters();

      if (user.SavedFilters != null && user.SavedFilters != "")
      {
        userFilters = JsonSerializer.Deserialize<Filters>(user.SavedFilters);
        SavedFilters = userFilters;
      }
      else
      {
        SavedFilters = null;
      }

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
      Active = user.Active;
    }
  }
}
