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
    public DateTime StartDate { get; set; }
    public int PrRank { get; set; }
    public int KomRank { get; set; } = 0;
    public int Rank { get; set; } = 0;



    public Effort(long id, int athleteId, long activityId,
      int elapsedTime, int movingTime, long segmentId,
      DateTime startDate,
      int prRank, int komRank)
    {
      Id = id;
      AthleteId = athleteId;
      ActivityId = activityId;
      ElapsedTime = elapsedTime;
      MovingTime = movingTime;
      SegmentId = segmentId;
      CreatedAt = DateTime.UtcNow;
      StartDate = startDate;
      PrRank = prRank;
      KomRank = komRank;
    }

    public Effort(ActivitySumResEffort eff)
    {
      Id = eff.Id;
      AthleteId = eff.Athlete.Id;
      ActivityId = eff.Activity.Id;
      ElapsedTime = eff.ElapsedTime;
      MovingTime = eff.MovingTime;
      SegmentId = eff.Segment.Id;
      StartDate = eff.StartDate;
      CreatedAt = DateTime.UtcNow;
      PrRank = eff.KomRank != null ? 1 : (eff.PrRank ?? 0);
      KomRank = eff.KomRank ?? 0;
    }
  }


}
