import { Api } from "api/api";

export const rescanAthleteActivity = async (id: string, athleteId: string) => {
  const url = `/api/rescanActivity/${id}/athlete/${athleteId}`;
  const response = await Api.get(url);

  return response.data;
};
