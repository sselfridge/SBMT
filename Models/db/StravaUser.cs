
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
    public string RefreshToken { get; set; }
    public string AccessToken { get; set; }
    public long ExpiresAt { get; set; }
    public DateTime JoinDate { get; set; }

    public StravaUser(int athleteId, string firstname, string lastname, string avatar, long expiresAt, string refreshToken, string accessToken)
    {
      AthleteId = athleteId;
      Firstname = firstname;
      Lastname = lastname;
      Avatar = avatar;
      JoinDate = DateTime.UtcNow;
      AccessToken = accessToken;
      RefreshToken = refreshToken;
      ExpiresAt = expiresAt;
    }

    public StravaUser(StravaOAuthResponseDTO oAuth)
    {
      var athlete = oAuth.Athlete;

      Firstname = athlete.Firstname;
      Lastname = athlete.Lastname;
      Avatar = athlete.ProfileMedium;
      AthleteId = athlete.Id;
      AccessToken = oAuth.AccessToken;
      RefreshToken = oAuth.RefreshToken;
      ExpiresAt = oAuth.ExpiresAt;
      JoinDate = DateTime.UtcNow;

    }

  }
}
