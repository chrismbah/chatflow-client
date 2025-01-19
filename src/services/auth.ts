import axiosInstance from "../config/axios";

type MutationData = {
  fullName: string;
  email: string;
  password: string;
};

export const registerUser = async (data: MutationData) => {
  const { data: response } = await axiosInstance.post("/auth/register", data);
  return response.data;
};
