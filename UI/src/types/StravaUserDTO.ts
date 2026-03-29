import { Filters } from "./Filters";
import { StravaClub } from "./StravaClub";

//StravaUserDTO

export interface User {
  athleteId: number;
  firstname: string;
  lastname: string;
  avatar: string;
  joinDate: string; // ISO 8601 date string
  sex: string;
  weight: number;
  scope: string;
  stravaClubs: StravaClub[];
  age: number;
  category: string;
  recentDistance: number;
  recentElevation: number;
  savedFilters: Filters | null;
  active: boolean;
}

export interface UserWithEmail extends User {
  email: string;
}

export interface AdminUser {
  athleteId: number;
  firstname: string;
  lastname: string;
  avatar: string;
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  sex: string;
  weight: number;
  scope?: string;
  age: number;
  category: string;
  recentDistance: number;
  recentElevation: number;
  active: boolean;
  years: string;
  email: string;
}
