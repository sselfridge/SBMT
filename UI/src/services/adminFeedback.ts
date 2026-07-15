import { FeedbackDTO } from "@/types/FeedbackDTO";
import { Api } from "api/api";

export const fetchFeedback = async () => {
  const url = "/api/admin/feedback";
  const response = await Api.get(url);
  return response.data;
};

export const toggleRead = async (id: string) => {
  const res = await Api.patch(`/api/admin/feedback/${id}`);
  return res.data;
};

export const deleteFeedback = async (id: string) => {
  const res = await Api.delete(`/api/admin/feedback/${id}`);
  return res.data;
};
