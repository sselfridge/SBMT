namespace TodoApi.Models.db
{
  public class NewEffortDTO
  {
    public long Id { get; set; } = 0; //TODO - older effort IDs in the data base are (int?) and all end in 000
    public int AthleteId { get; set; } = 0;
    public long ActivityId { get; set; }
    public int ElapsedTime { get; set; }
    public int MovingTime { get; set; }
    public long SegmentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime StartDate { get; set; }
    public bool ManualEffort { get; set; } = true;

    public NewEffortDTO(
      long id,
      int athleteId,
      long activityId,
      int elapsedTime,
      int movingTime,
      long segmentId,
      DateTime startDate
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
    }
  }
}
