using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class StravaAthleteProfile
  {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("resource_state")]
    public int ResourceState { get; set; }

    [JsonPropertyName("firstname")]
    public string Firstname { get; set; }

    [JsonPropertyName("lastname")]
    public string Lastname { get; set; }

    [JsonPropertyName("city")]
    public string City { get; set; }

    [JsonPropertyName("sex")]
    public string? Sex { get; set; }

    [JsonPropertyName("premium")]
    public bool Premium { get; set; }

    [JsonPropertyName("summit")]
    public bool Summit { get; set; }

    //BADGE_TYPES:
    //EMPLOYEE => 4,
    //PRO => 3,
    //AMBASSADOR => 2,
    //PREMIUM => 1,
    //FREE => 0
    [JsonPropertyName("badge_type_id")]
    public int BadgeTypeId { get; set; }

    [JsonPropertyName("weight")]
    public double? Weight { get; set; }

    [JsonPropertyName("profile_medium")]
    public string ProfileMedium { get; set; }

    [JsonPropertyName("athlete_type")]
    public int AthleteType { get; set; }

    [JsonPropertyName("ftp")]
    public int? Ftp { get; set; }

    [JsonPropertyName("clubs")]
    public StravaClubResponse[] Clubs { get; set; }
  }
}
