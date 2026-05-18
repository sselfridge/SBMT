import axios from "axios";

export const toggleRead = async (id: string) => {
  const res = await axios.patch(`/api/admin/feedback/${id}`);
  console.log("res: ", res);
  return res;
};
