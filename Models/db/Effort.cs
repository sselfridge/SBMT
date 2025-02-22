﻿using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db
{
  public class Effort
  {
    public long Id { get; set; } //TODO - older effort IDs in the data base are (int?) and all end in 000
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
    public bool ManualEffort { get; set; } = false;

    public Effort(
      long id,
      int athleteId,
      long activityId,
      int elapsedTime,
      int movingTime,
      long segmentId,
      DateTime startDate,
      int prRank,
      int komRank
    )
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

    public Effort(
      long id,
      int athleteId,
      long activityId,
      int elapsedTime,
      int movingTime,
      long segmentId,
      DateTime startDate,
      int prRank,
      int komRank,
      bool manualEffort
    )
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
      ManualEffort = manualEffort;
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

    public Effort(NewEffortDTO newEffort)
    {
      if (newEffort.Id != 0)
      {
        Id = newEffort.Id;
      }
      AthleteId = newEffort.AthleteId;
      ActivityId = newEffort.ActivityId;
      ElapsedTime = newEffort.ElapsedTime;
      MovingTime = newEffort.MovingTime;
      SegmentId = newEffort.SegmentId;
      CreatedAt = newEffort.CreatedAt;
      StartDate = newEffort.StartDate;
      ManualEffort = true;
    }
  }
}
