export interface SegmentLeaderboardEntry {
  id: string;
  elapsedTime: number;
  activityId: string;
  athleteId: number;
  firstname: string;
  lastname: string;
  avatar: string;
}

export type SegmentLeaderboard = SegmentLeaderboardEntry[];
