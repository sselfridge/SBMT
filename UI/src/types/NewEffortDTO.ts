export interface NewEffortDTO {
  id: number;
  athleteId: number;
  activityId: number;
  elapsedTime: number;
  movingTime: number;
  segmentId: number;
  createdAt: string; // ISO 8601 date string
  startDate: string; // ISO 8601 date string
  manualEffort: boolean;
}
