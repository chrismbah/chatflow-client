import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat, fetchAllChats } from "@/services/chat";
import toast from "react-hot-toast";
import { responseHandler } from "@/utils/responseHandler";
import { Chat } from "@/types";
import { CHATS, USERS } from "@/constants/query-keys";
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
    queryKey: [CHATS.FETCH_CHATS],
    queryFn: fetchAllChats,
  });

  const {
    mutate: createUserChat,
    isPending: isCreatingChat,
    isError: isCreatingChatError,
  } = useMutation({
    mutationFn: createChat,
    onMutate: (userId: string) => {
      // Add user ID to loading list
      setLoadingUsers((prev) => [...prev, userId]);
    },
    onSuccess: (data, userId) => {
      // Remove user ID from loading list on success
      setLoadingUsers((prev) => prev.filter((id) => id !== userId));
      queryClient.invalidateQueries({
        queryKey: [CHATS.FETCH_CHATS],
        exact: true,
      });
      queryClient.invalidateQueries({
        // Doesnt refresh the users list
        queryKey: [USERS.FETCH_USERS],
        exact: true,
      });
      queryClient.refetchQueries({ queryKey: [USERS.FETCH_USERS] }); // Force fetch
      toast.success("User Added Successfully");
    },
    onError: (error, userId) => {
      // Remove user ID from loading list on error
      setLoadingUsers((prev) => prev.filter((id) => id !== userId));
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
    currentChat,
    setCurrentChat,
  };
};
