import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MESSAGES } from "@/constants/query-keys";
import { fetchMessages, createMessage } from "@/services/messages";
import toast from "react-hot-toast";
import { responseHandler } from "@/utils/responseHandler";

export const useMessages = (chatId: string) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const {
    data: allMessages,
    error: isMessagesError,
    isLoading: isMessagesLoading,
  } = useQuery({
    queryKey: [MESSAGES.FETCH_MESSAGES, chatId],
    queryFn: () => fetchMessages(chatId),
    retry: true,
    enabled: !!chatId,
  });

  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
    isError: isSendingMessageError,
  } = useMutation({
    mutationFn: () => createMessage({ chatId, content: message }),
    onSuccess: () => {
      toast.success("Message sent successfully");
      queryClient.invalidateQueries({
        queryKey: [MESSAGES.FETCH_MESSAGES],
        exact: true,
      });
      setMessage("");
    },
    onError: (error) => {
      console.error("Error creating chat", error);
      toast.error(responseHandler(error));
    },
  });

  return {
    allMessages,
    isMessagesError,
    isMessagesLoading,
    sendMessage,
    isSendingMessage,
    isSendingMessageError,
    message,
    setMessage,
  };
};
