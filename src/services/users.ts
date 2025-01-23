import axiosInstance from "@/config/axios";

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/users/profile");
  return res.data;
};

export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.data;
};
