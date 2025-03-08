import axiosInstance from "@/config/axios";

type SignUpMutation = {
  fullName: string;
  email: string;
  password: string;
};
type LoginMutation = {
  email: string;
  password: string;
};

export const registerUser = async (data: SignUpMutation) => {
  const { data: response } = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginMutation) => {
  const { data: response } = await axiosInstance.post("/auth/login", data);
  return response.data;
};
