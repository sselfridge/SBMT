using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  //More reminder/shame files to see about getting clubs implmented
  //  But also a reminder that I should get the base functions working first...
  public class StravaClubResponse
  {
    [JsonPropertyName("id")]
    public int Id { get; set; }
    [JsonPropertyName("resource_state")]
    public int ResourceState { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("profile_medium")]
    public string ProfileMedium { get; set; }
    [JsonPropertyName("profile")]
    public string Profile { get; set; }
    [JsonPropertyName("cover_photo")]
    public string CoverPhoto { get; set; }
    [JsonPropertyName("cover_photo_small")]
    public string CoverPhotoSmall { get; set; }
    [JsonPropertyName("city")]
    public string City { get; set; }
    [JsonPropertyName("state")]
    public string State { get; set; }
    [JsonPropertyName("country")]
    public string Country { get; set; }
    [JsonPropertyName("private")]
    public Boolean Private { get; set; }
    [JsonPropertyName("member_count")]
    public int MemberCount { get; set; }
    [JsonPropertyName("featured")]
    public Boolean Featured { get; set; }
    [JsonPropertyName("verified")]
    public Boolean Verified { get; set; }
    [JsonPropertyName("url")]
    public string Url { get; set; }

  }
}

