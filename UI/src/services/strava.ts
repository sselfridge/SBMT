import { Api } from "api/api";

export const updateXoms = async (year: string) => {
  const url = `/api/strava/updateXoms/${year}`;
  const response = await Api.get(url);

  return response.data;
};

export const userRefresh = async (athleteId: number) => {
  const url = `/api/strava/userRefresh/${athleteId}`;
  const response = await Api.get(url);
  return response.data;
};
