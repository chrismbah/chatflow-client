import axiosInstance from "@/config/axios";
import { User } from "@/types";

export const fetchAllChats = async () => {
  const res = await axiosInstance.get("/chat");
  return res.data.data;
};

export const createChat = async (user: User) => {
  const userId = user._id;
  const res = await axiosInstance.post("/chat", { userId });
  return res.data.data;
};
