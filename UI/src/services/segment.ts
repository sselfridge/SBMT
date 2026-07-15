import { Api } from "api/api";

export const getSegmentDetail = async (segmentId: number, year: string) => {
  const url = `/api/segments/${segmentId}/?year=${year}`;
  const response = await Api.get(url);
  console.log("response: ", response);
  return response.data;
};
