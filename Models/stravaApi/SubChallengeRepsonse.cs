using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class SubChallengeRepsonse
  {
    [JsonPropertyName("hub.challenge")]
    public string Challenge { get; set; }

    public SubChallengeRepsonse(string challenge) { Challenge = challenge; }
  }


}
