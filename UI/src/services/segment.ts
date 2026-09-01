import { Segment } from "@/types/db/Segment";
import { Api } from "api/api";

export const getSegmentDetail = async (segmentId: number, year: string) => {
  const url = `/api/segments/${segmentId}/?year=${year}`;
  const response = await Api.get(url);
  return response.data;
};

//admin

export const refreshAdminSegments = async () => {
  const url = `/api/admin/segments`;
  const response = await Api.get(url);
  return response.data;
};

export const updateSegment = async (segment: Segment) => {
  const url = `/api/admin/segments/${segment.id}`;
  const response = await Api.put(url, segment);
  return response.data;
};
