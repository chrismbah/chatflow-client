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
  console.log(res.data.data);
  return res.data.data;
};
