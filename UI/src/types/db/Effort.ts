export interface Effort {
  id: number;
  athleteId: number;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  segmentId: number;
  createdAt: string; // ISO 8601
  startDate: string; // ISO 8601
  prRank: number;
  komRank: number;
  rank: number;
  manualEffort: boolean;
}
