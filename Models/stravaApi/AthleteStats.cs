using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class AthleteStats
  {
    [JsonPropertyName("recent_ride_totals")]
    public RecentRideTotals RecentTotals { get; set; }
  }

  public class RecentRideTotals
  {
    [JsonPropertyName("distance")]
    public double Distance { get; set; }

    [JsonPropertyName("moving_time")]
    public int MovingTime { get; set; }

    [JsonPropertyName("elevation_gain")]
    public double ElevationGain { get; set; }
  }
}
