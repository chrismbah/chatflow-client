import axiosInstance from "@/config/axios";

export const fetchAllChats = async () => {
  const res = await axiosInstance.get("/chat");
  return res.data.data;
};

export const createOrAccessChat = async (userId: string) => {
  const res = await axiosInstance.post("/chat", { userId });
  console.log("Accessing chat..");
  return res.data.data;
};
