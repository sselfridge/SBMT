export interface Segment {
  id: number;
  resourceState: number;
  name: string;
  activityType: string;
  distance: number;
  averageGrade: number;
  maximumGrade: number;
  elevationHigh: number;
  elevationLow: number;
  startLatlng: [number, number];
  endLatlng: [number, number];
  climbCategory: number;
  totalElevationGain: number;
  effortCount: number;
  athleteCount: number;
  polyline: string;
  kom: string | null;
  qom: string | null;
  surfaceType: string;
  years: string;
}
