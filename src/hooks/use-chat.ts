import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrAccessChat, fetchAllChats } from "@/services/chat";
import toast from "react-hot-toast";
import { responseHandler } from "@/utils/responseHandler";
import { Chat } from "@/types/user";

export const useChat = () => {
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const queryClient = useQueryClient();
  const {
    data: chatsData = [],
    error: isChatsError,
    isLoading: isFetchingChats,
    refetch: refetchChats,
  } = useQuery({
    queryKey: ["fetchAllChats"],
    queryFn: fetchAllChats,
  });

  const {
    mutate: createUserChat,
    isPending: isCreatingChat,
    isError: isCreatingChatError,
  } = useMutation({
    mutationFn: createOrAccessChat,
    onMutate: (userId: string) => {
      // Add user ID to loading list
      setLoadingUsers((prev) => [...prev, userId]);
    },
    onSuccess: (data, userId) => {
      // Remove user ID from loading list on success
      setLoadingUsers((prev) => prev.filter((id) => id !== userId));
      queryClient.invalidateQueries({
        queryKey: ["fetchAllChats"],
        exact: true, // Ensures that only this specific query is invalidated
      });
      queryClient.invalidateQueries({
        queryKey: ["getUsers"],
        exact: true, // Ensures that only this specific query is invalidated
      });
      toast.success("User Added Successfully");
    },
    onError: (error, userId) => {
      // Remove user ID from loading list on error
      setLoadingUsers((prev) => prev.filter((id) => id !== userId));
      console.error("Error creating chat", error);
      toast.error(responseHandler(error));
    },
  });

  const {
    mutate: accessChat,
    isPending: isAccessingChat,
    isError: isAccessingChatError,
  } = useMutation({
    mutationFn: createOrAccessChat,
    onSuccess: (data) => {
      setCurrentChat(data);
      console.log(data);
    },
    onError: (error) => {
      console.error("Error creating chat", error);
      toast.error(responseHandler(error));
    },
  });

  return {
    chatsData,
    isChatsError,
    isFetchingChats,
    refetchChats,
    createUserChat,
    isCreatingChat,
    isCreatingChatError,
    loadingUsers,
    accessChat,
    isAccessingChat,
    isAccessingChatError,
    currentChat,
  };
};
