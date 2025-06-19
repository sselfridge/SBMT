using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class StravaOAuthResponseDTO : StravaOAuthResponse
  {
    public int Id { get; set; }

    public StravaOAuthResponseDTO(StravaOAuthResponse s)
    {
      TokenType = s.TokenType;
      ExpiresAt = s.ExpiresAt;
      ExpiresIn = s.ExpiresIn;
      RefreshToken = s.RefreshToken;
      AccessToken = s.AccessToken;
      Athlete = s.Athlete;
      Id = s.Athlete.Id;
    }
  }

  public class StravaOAuthResponse
  {
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; }

    [JsonPropertyName("expires_at")]
    public long ExpiresAt { get; set; }

    [JsonPropertyName("expires_in")]
    public long ExpiresIn { get; set; }

    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }

    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    public StravaAthlete Athlete { get; set; }
  }

  public class StravaAthlete
  {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; }

    [JsonPropertyName("resource_state")]
    public int ResourceState { get; set; }

    [JsonPropertyName("firstname")]
    public string Firstname { get; set; }

    [JsonPropertyName("lastname")]
    public string Lastname { get; set; }

    [JsonPropertyName("premium")]
    public bool Premium { get; set; }

    [JsonPropertyName("profile_medium")]
    public string ProfileMedium { get; set; }

    [JsonPropertyName("profile")]
    public string Profile { get; set; }
  }
}
