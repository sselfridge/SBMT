import { StravaClub } from "../StravaClub";

export interface StravaUser {
  athleteId: number;
  firstname: string;
  lastname: string;
  avatar: string;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  joinDate: string; // ISO 8601
  sex: string;
  weight: number;
  scope: string;
  age: number;
  category: string;
  recentDistance: number;
  recentElevation: number;
  stravaClubs: StravaClub[];
  savedFilters: string; // JSON string — use Filters type after parsing
  active: boolean;
  years: string;
}

export interface OauthStravaUser {
  athleteId: number;
  refreshToken: string;
  accessToken: string;
  expiresAt: number;
  scope: string;
}
