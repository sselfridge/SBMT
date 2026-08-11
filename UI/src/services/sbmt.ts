import { Api } from "api/api";

export const rescanAthleteActivity = async (id: string, athleteId: string) => {
  const url = `/api/rescanActivity/${id}/athlete/${athleteId}`;
  const response = await Api.get(url);

  return response.data;
};

export const getCurrentAthlete = async () => {
  const url = `/api/athletes/current`;
  const response = await Api.get(url);
  return response.data;
};

export const getAthletes = async (year: string | null) => {
  const url = `/api/athletes?year=${year}`;
  const response = await Api.get(url);
  return response.data;
};

export const getAthlete = async (athleteId: string | number) => {
  const url = `/api/athletes/${athleteId}`;
  const response = await Api.get(url);
  return response.data;
};

export const getAthleteEfforts = async (
  athleteId: string | number,
  year: string | null,
) => {
  const url = `/api/athletes/${athleteId}/efforts?year=${year}`;
  const response = await Api.get(url);
  return response.data;
};
