﻿namespace TodoApi.Models
{
  public class LeaderboardEntry
  {
    public int Id { get; set; }

    public int rank { get; set; }
    public string AthleteName { get; set; }
    public string Avatar { get; set; }
    public int Completed { get; set; }
    public int TotalTime { get; set; }

    public LeaderboardEntry(int athleteId, string athleteName, string avatar, int completed, int totalTime)
    {
      Id = athleteId;

      AthleteName = athleteName;
      Avatar = avatar;
      Completed = completed;
      TotalTime = totalTime;
      rank = 0;
    }
  }


}
