export interface LeaderboardEntry {
  id: number;
  rank: number;
  athleteName: string;
  avatar: string;
  completed: number;
  totalTime: number;
  totalDistance: number;
  totalElevation: number;
  recentDistance: number;
  recentElevation: number;
  category: string;
  segmentCount: number;
}
