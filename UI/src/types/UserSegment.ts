// Corresponds to the DTO shapes in Models/UserSegment.cs
// IDs for segments/activities/efforts are serialized as strings (converted from long in the DTO)

export interface UserSegmentEffort {
  id: string;
  createdAt: string; // ISO 8601 date string
  elapsedTime: number;
  activityId: string;
}

export interface UserSegment {
  athleteId: number;
  segmentId: string;
  segmentName: string;
  bestTime: number;
  bestActId: string;
  bestEffortId: string;
  surfaceType: string;
  efforts: UserSegmentEffort[];
}
