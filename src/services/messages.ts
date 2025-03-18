import axiosInstance from "@/config/axios";

export const createMessage = async (data: {
  chatId: string;
  content: string;
}) => {
  const res = await axiosInstance.post("/message", data);
  return res.data.data;
};

export const fetchMessages = async (chatId: string) => {
  const res = await axiosInstance.get(`/message`, {
    params: { chatId },
  });
  return res.data.data;
};

export const readMessages = async (data: { chatId: string }) => {
  const res = await axiosInstance.patch(`/message/read`, data);
  return res.data.data;
};
