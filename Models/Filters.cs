using System.Text.Json.Serialization;

namespace TodoApi.Models
{
  public class Filters
  {
    [JsonPropertyName("surface")]
    public string? Surface { get; set; }

    [JsonPropertyName("gender")]
    public string? Gender { get; set; }

    [JsonPropertyName("age")]
    public string? Age { get; set; }

    [JsonPropertyName("category")]
    public string? Category { get; set; }

    [JsonPropertyName("distance")]
    public string? Distance { get; set; }

    [JsonPropertyName("elevation")]
    public string? Elevation { get; set; }

    [JsonPropertyName("clubId")]
    public int ClubId { get; set; }
  }
}
