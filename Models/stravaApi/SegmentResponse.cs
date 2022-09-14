using System.Text.Json.Serialization;

namespace TodoApi.Models.stravaApi
{
  public class SegmentResponse
  {

    [JsonPropertyName("id")]
    public long Id { get; set; }
    [JsonPropertyName("resource_state")]
    public long ResourceState { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("activity_type")]
    public string ActivityType { get; set; }
    [JsonPropertyName("distance")]
    public float Distance { get; set; }
    [JsonPropertyName("average_grade")]
    public float AverageGrade { get; set; }
    [JsonPropertyName("maximum_grade")]
    public float MaximumGrade { get; set; }
    [JsonPropertyName("elevation_high")]
    public float ElevationHigh { get; set; }
    [JsonPropertyName("elevation_low")]
    public float ElevationLow { get; set; }
    [JsonPropertyName("start_latlng")]
    public float[] StartLatlng { get; set; }
    [JsonPropertyName("end_latlng")]
    public float[] EndLatlng { get; set; }
    [JsonPropertyName("climb_category")]
    public long ClimbCategory { get; set; }
    [JsonPropertyName("total_elevation_gain")]
    public float TotalElevationGain { get; set; }
    [JsonPropertyName("effort_count")]
    public long EffortCount { get; set; }
    [JsonPropertyName("athlete_count")]
    public long AthleteCount { get; set; }

    [JsonPropertyName("map")]
    public SegmentResMap Map { get; set; }

    [JsonPropertyName("xoms")]
    public SegmentResXoms Xoms { get; set; }

  }


  public class SegmentResMap
  {
    [JsonPropertyName("polyline")]
    public string Polyline { get; set; }
  }


  public class SegmentResXoms
  {
    [JsonPropertyName("kom")]
    public string Kom { get; set; }
    [JsonPropertyName("qom")]
    public string Qom { get; set; }
    [JsonPropertyName("overall")]
    public string Overall { get; set; }
  }


  public class SegmentResAthleteStats
  //Stretch: Add in checks for each athlete to check their PR for each segment
  {
    [JsonPropertyName("pr_elapsed_time")]
    public long PrElapsedTime { get; set; }

    [JsonPropertyName("pr_date")]
    public long PrDate { get; set; }

    [JsonPropertyName("pr_activity_id")]
    public string PrActivityId { get; set; }

    [JsonPropertyName("effort_count")]
    public long EffortCount { get; set; }
  }

}
