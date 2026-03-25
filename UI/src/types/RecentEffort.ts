export interface RecentEffort {
  id: string;
  name: string;
  athleteId: number;
  avatar: string;
  activityId: string;
  created: string;
  elapsedTime: number;
  segmentId: string;
  segmentName: string;
  surfaceType: string;
  startDate: string;
  rank: number;
  prRank: number | null;
}
