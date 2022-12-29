namespace TodoApi.Models
{
  public class UserSegment
  {
    public int AthleteId { get; set; }
    public long SegmentId { get; set; }
    public string SegmentName { get; set; }
    public int BestTime { get; set; }
    public long BestActId { get; set; }
    public long BestEffortId { get; set; }
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
      BestEffortId = 0;
      SurfaceType = surfaceType;
    }

    public void AddEffort(UserSegmentEffort effort)
    {
      if (effort.ElapsedTime < BestTime)
      {
        BestActId = effort.ActivityId;
        BestTime = effort.ElapsedTime;
        BestEffortId = effort.Id;
      }
      Efforts.Add(effort);
    }

  }

  public class UserSegmentEffort
  {
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ElapsedTime { get; set; }
    public long ActivityId { get; set; }

    public UserSegmentEffort(long id, DateTime createdAt, int elapsedTime, long activityId)
    {
      Id = id;
      CreatedAt = createdAt;
      ElapsedTime = elapsedTime;
      ActivityId = activityId;
    }
  }


  public class UserSegmentDTO
  {
    public int AthleteId { get; set; }
    public string SegmentId { get; set; }
    public string SegmentName { get; set; }
    public int BestTime { get; set; }
    public string BestActId { get; set; }
    public string BestEffortId { get; set; }
    public string SurfaceType { get; set; }
    public List<UserSegmentEffortDTO> Efforts { get; set; }

    public UserSegmentDTO(UserSegment userSegment)
    {
      AthleteId = userSegment.AthleteId;
      SegmentId = $"{userSegment.SegmentId}";
      SegmentName = userSegment.SegmentName;
      BestTime = userSegment.BestTime;
      BestActId = $"{userSegment.BestActId}";
      BestEffortId = $"{userSegment.BestEffortId}";
      SurfaceType = userSegment.SurfaceType;
      Efforts = userSegment.Efforts.Select(e => new UserSegmentEffortDTO(e)).ToList();
    }
  }
  public class UserSegmentEffortDTO
  {
    public string Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ElapsedTime { get; set; }
    public string ActivityId { get; set; }

    public UserSegmentEffortDTO(UserSegmentEffort effort)
    {
      Id = $"{effort.Id}";
      CreatedAt = effort.CreatedAt;
      ElapsedTime = effort.ElapsedTime;
      ActivityId = $"{effort.ActivityId}";
    }
  }


}
