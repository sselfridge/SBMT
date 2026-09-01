import { AdminUser } from "@/types/StravaUserDTO";
import { Api } from "api/api";

export const fetchAdminUsers = async () => {
  const url = "/api/admin/users";
  const response = await Api.get(url);
  return response.data;
};

export const updateUsers = async (users: AdminUser[]) => {
  const url = `/api/admin/users`;
  const response = await Api.patch(url, users);

  return response.data;
};
