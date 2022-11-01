namespace TodoApi.Models
{
  public class UserSegment
  {
    public int AthleteId { get; set; }
    public long SegmentId { get; set; }
    public string SegmentName { get; set; }
    public int BestTime { get; set; }
    public string SurfaceType { get; set; }

    public List<UserSegmentEffort> Efforts { get; set; }

    public UserSegment(int athleteId, long segmentId, string segmentName, string surfaceType)
    {
      AthleteId = athleteId;
      SegmentId = segmentId;
      SegmentName = segmentName;
      Efforts = new List<UserSegmentEffort>();
      BestTime = int.MaxValue;
      SurfaceType = surfaceType;
    }

    public void AddEffort(UserSegmentEffort effort)
    {
      if (effort.ElapsedTime < BestTime) BestTime = effort.ElapsedTime;
      Efforts.Add(effort);
    }

  }

  public class UserSegmentEffort
  {
    public DateTime CreatedAt { get; set; }
    public int ElapsedTime { get; set; }

    public UserSegmentEffort(DateTime createdAt, int elapsedTime)
    {
      CreatedAt = createdAt;
      ElapsedTime = elapsedTime;
    }
  }


}
