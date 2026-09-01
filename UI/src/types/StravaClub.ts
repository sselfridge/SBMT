// Corresponds to Models/db/StravaClub.cs
// Note: stravaUsers omitted — circular reference, not needed on the client
export interface StravaClub {
  id: number;
  name: string;
  profileMedium: string;
  url: string;
}
