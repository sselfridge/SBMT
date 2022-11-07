namespace TodoApi.Models
{
  public class UserSegment
  {
    public int AthleteId { get; set; }
    public long SegmentId { get; set; }
    public string SegmentName { get; set; }
    public int BestTime { get; set; }
    public long BestActId { get; set; }
    public string SurfaceType { get; set; }

    public List<UserSegmentEffort> Efforts { get; set; }

    public UserSegment(int athleteId, long segmentId, string segmentName, string surfaceType)
    {
      AthleteId = athleteId;
      SegmentId = segmentId;
      SegmentName = segmentName;
      Efforts = new List<UserSegmentEffort>();
      BestTime = int.MaxValue;
      BestActId = 0;
      SurfaceType = surfaceType;
    }

    public void AddEffort(UserSegmentEffort effort)
    {
      if (effort.ElapsedTime < BestTime)
      {
        BestActId = effort.ActivityId;
        BestTime = effort.ElapsedTime;
      }
      Efforts.Add(effort);
    }

  }

  public class UserSegmentEffort
  {
    public DateTime CreatedAt { get; set; }
    public int ElapsedTime { get; set; }
    public long ActivityId { get; set; }

    public UserSegmentEffort(DateTime createdAt, int elapsedTime, long activityId)
    {
      CreatedAt = createdAt;
      ElapsedTime = elapsedTime;
      ActivityId = activityId;
    }
  }


}
