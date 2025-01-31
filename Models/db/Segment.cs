using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db
{
  public class Segment
  {
    public long Id { get; set; }
    public long ResourceState { get; set; }
    public string Name { get; set; }
    public string ActivityType { get; set; }
    public float Distance { get; set; }
    public float AverageGrade { get; set; }
    public float MaximumGrade { get; set; }
    public float ElevationHigh { get; set; }
    public float ElevationLow { get; set; }
    public float[] StartLatlng { get; set; }
    public float[] EndLatlng { get; set; }
    public long ClimbCategory { get; set; }
    public float TotalElevationGain { get; set; }
    public long EffortCount { get; set; }
    public long AthleteCount { get; set; }

    public string Polyline { get; set; }

    public string? Kom { get; set; }
    public string? Qom { get; set; }
    public string SurfaceType { get; set; } = "road";
    public string Years { get; set; } = "";

    public Segment(
      long id,
      long resourceState,
      string name,
      string activityType,
      float distance,
      float averageGrade,
      float maximumGrade,
      float elevationHigh,
      float elevationLow,
      float[] startLatlng,
      float[] endLatlng,
      long climbCategory,
      float totalElevationGain,
      long effortCount,
      long athleteCount,
      string polyline,
      string kom,
      string qom
    )
    {
      Id = id;
      ResourceState = resourceState;
      Name = name;
      ActivityType = activityType;
      Distance = distance;
      AverageGrade = averageGrade;
      MaximumGrade = maximumGrade;
      ElevationHigh = elevationHigh;
      ElevationLow = elevationLow;
      StartLatlng = startLatlng;
      EndLatlng = endLatlng;
      ClimbCategory = climbCategory;
      TotalElevationGain = totalElevationGain;
      EffortCount = effortCount;
      AthleteCount = athleteCount;
      Polyline = polyline;
      Kom = kom;
      Qom = qom;
      //SurfaceType = surfaceType;
    }

    public Segment(SegmentResponse res)
    {
      Id = res.Id;
      ResourceState = res.ResourceState;
      Name = res.Name;
      ActivityType = res.ActivityType;
      Distance = res.Distance;
      AverageGrade = res.AverageGrade;
      MaximumGrade = res.MaximumGrade;
      ElevationHigh = res.ElevationHigh;
      ElevationLow = res.ElevationLow;
      StartLatlng = res.StartLatlng;
      EndLatlng = res.EndLatlng;
      ClimbCategory = res.ClimbCategory;
      TotalElevationGain = res.TotalElevationGain;
      EffortCount = res.EffortCount;
      AthleteCount = res.AthleteCount;
      Polyline = res.Map.Polyline;
      Kom = res.Xoms.Kom;
      Qom = res.Xoms.Qom;
      //SurfaceType = "road";
    }

    public Segment(SegmentResponse res, string surfaceType)
    {
      Id = res.Id;
      ResourceState = res.ResourceState;
      Name = res.Name;
      ActivityType = res.ActivityType;
      Distance = res.Distance;
      AverageGrade = res.AverageGrade;
      MaximumGrade = res.MaximumGrade;
      ElevationHigh = res.ElevationHigh;
      ElevationLow = res.ElevationLow;
      StartLatlng = res.StartLatlng;
      EndLatlng = res.EndLatlng;
      ClimbCategory = res.ClimbCategory;
      TotalElevationGain = res.TotalElevationGain;
      EffortCount = res.EffortCount;
      AthleteCount = res.AthleteCount;
      Polyline = res.Map.Polyline;
      Kom = res.Xoms.Kom;
      Qom = res.Xoms.Qom;
      SurfaceType = surfaceType;
    }
  }
}
