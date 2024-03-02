using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class ActivitySummaryResponse
  {
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("athlete")]
    public ActivitySummaryResAthlete? Athlete { get; set; }

    [JsonPropertyName("start_date")]
    [JsonConverter(typeof(JsonDateTimeConverter))]

    public DateTime StartDate { get; set; }

    [JsonPropertyName("private")]
    public Boolean Private { get; set; }

    [JsonPropertyName("visibility")]
    public string? Visibility { get; set; }

    [JsonPropertyName("segment_efforts")]
    public ActivitySumResEffort[]? SegmentEfforts { get; set; }

  }

  public class ActivitySummaryResAthlete
  {
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("resource_state")]
    public long ResourceState { get; set; }
  }

  public class ActivitySummaryResActivity
  {
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("resource_state")]
    public long ResourceState { get; set; }
  }
  public class ActivitySumResEffort
  {
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("elapsed_time")]
    public int ElapsedTime { get; set; }

    [JsonPropertyName("moving_time")]
    public int MovingTime { get; set; }

    [JsonPropertyName("start_date")]
    [JsonConverter(typeof(JsonDateTimeConverter))]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("segment")]
    public ActivitySumResSegment Segment { get; set; }

    [JsonPropertyName("athlete")]
    public ActivitySummaryResAthlete Athlete { get; set; }
    [JsonPropertyName("activity")]
    public ActivitySummaryResActivity Activity { get; set; }
    [JsonPropertyName("pr_rank")]
    public int? PrRank { get; set; }
  }

  public class ActivitySumResSegment
  {
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

  }

}
