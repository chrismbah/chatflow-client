import axiosInstance from "@/config/axios";

export const fetchAllChats = async () => {
  const res = await axiosInstance.get("/chat");
  return res.data.data;
};

export const createOrAccessChat = async (userId: string) => {
  const res = await axiosInstance.post("/chat", { userId });
  return res.data.data;
};
