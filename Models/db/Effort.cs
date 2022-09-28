using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db
{
  public class Effort
  {
    public long Id { get; set; }
    public int AthleteId { get; set; }
    public long ActivityId { get; set; }
    public int ElapsedTime { get; set; }
    public int MovingTime { get; set; }
    public long SegmentId { get; set; }
    public DateTime CreatedAt { get; set; }



    public Effort(long id, int athleteId, long activityId, int elapsedTime, int movingTime, long segmentId)
    {
      Id = id;
      AthleteId = athleteId;
      ActivityId = activityId;
      ElapsedTime = elapsedTime;
      MovingTime = movingTime;
      SegmentId = segmentId;
      CreatedAt = CreatedAt;
    }

    public Effort(ActivitySumResEffort eff)
    {
      Id = eff.Id;
      AthleteId = eff.Athlete.Id;
      ActivityId = eff.Activity.Id;
      ElapsedTime = eff.ElapsedTime;
      MovingTime = eff.MovingTime;
      SegmentId = eff.Segment.Id;
      CreatedAt = DateTime.UtcNow;
    }
  }


}
