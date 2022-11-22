
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
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


    public StravaUser(int athleteId, string firstname, string lastname, string avatar, long expiresAt, string refreshToken, string accessToken, string sex, double weight, string? scope)
    {
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
    }

    public StravaUser(OauthStravaUser oAuth, StravaAthleteProfile profile)
    {
      AccessToken = oAuth.AccessToken;
      RefreshToken = oAuth.RefreshToken;
      ExpiresAt = oAuth.ExpiresAt;

      Firstname = profile.Firstname;
      Lastname = profile.Lastname;
      Avatar = profile.ProfileMedium;
      AthleteId = profile.Id;
      Sex = profile.Sex ?? "none";
      Weight = profile.Weight ?? 0;

      JoinDate = DateTime.UtcNow;
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
