
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db

{
  [Index(nameof(AthleteId), IsUnique = true)]
  public class StravaUser
  {
    [Key]
    public int AthleteId { get; set; }
    public string Firstname { get; set; }
    public string Lastname { get; set; }
    public string Avatar { get; set; }
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
    public long ExpiresAt { get; set; }
    public DateTime JoinDate { get; set; }
    public string Sex { get; set; }
    public double Weight { get; set; }
    public string Scope { get; set; }
    public int Age { get; set; }
    public string Category { get; set; }
    public double RecentDistance { get; set; }
    public double RecentElevation { get; set; }

    public ICollection<StravaClub> StravaClubs { get; set; }

    public string SavedFilters { get; set; }

    public bool Active { get; set; }

    public string Years { get; set; }

    //public StravaUser() { }

    [JsonConstructor] // Parameterized constructor annotated with JsonConstructorAttribute
    public StravaUser(int athleteId, string firstname, string lastname, string avatar, long expiresAt, string refreshToken, string accessToken, string sex, double weight, string? scope, int age, string category, double recentDistance, double recentElevation, bool active, string years)
    {
      //This one is used for incoming JSON objects, such as admin user update
      AthleteId = athleteId;
      Firstname = firstname;
      Lastname = lastname;
      Avatar = avatar;
      AccessToken = accessToken;
      RefreshToken = refreshToken;
      ExpiresAt = expiresAt;
      Sex = sex;
      Weight = weight;
      Scope = scope ?? "";
      JoinDate = DateTime.UtcNow;
      StravaClubs = new List<StravaClub>();
      Age = age;
      Category = category;
      RecentDistance = recentDistance;
      RecentElevation = recentElevation;
      SavedFilters = "";
      Active = active;
      Years = years;
    }


    public StravaUser(OauthStravaUser oAuth, StravaAthleteProfile profile)
    {
      AccessToken = oAuth.AccessToken;
      RefreshToken = oAuth.RefreshToken;
      ExpiresAt = oAuth.ExpiresAt;
      Scope = oAuth.Scope;

      Firstname = profile.Firstname;
      Lastname = profile.Lastname;
      Avatar = profile.ProfileMedium;
      AthleteId = profile.Id;
      Sex = profile.Sex ?? "none";
      Weight = profile.Weight ?? 0;

      JoinDate = DateTime.MinValue;
      StravaClubs = new List<StravaClub>();

      Age = 0;
      Category = "None";
      RecentDistance = 0;
      RecentElevation = 0;

      SavedFilters = "";
      Years = DateTime.Now.Year.ToString();
      Active = false;
    }


  }

  public class OauthStravaUser
  {
    public int AthleteId { get; set; }
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
    public long ExpiresAt { get; set; }
    public string Scope { get; set; }


    public OauthStravaUser(StravaOAuthResponseDTO oAuth, string scope)
    {
      var athlete = oAuth.Athlete;
      AthleteId = athlete.Id;
      AccessToken = oAuth.AccessToken;
      RefreshToken = oAuth.RefreshToken;
      ExpiresAt = oAuth.ExpiresAt;
      Scope = scope;
    }
  }
}
