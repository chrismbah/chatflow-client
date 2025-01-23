import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat, fetchAllChats } from "@/services/chat";

export const useChat = () => {
  const queryClient = useQueryClient(); // Access React Query's cache
  const {
    data: chats = [], // Default to an empty array to prevent undefined issues
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
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchAllChats"],
        exact: true, // Ensures that only this specific query is invalidated
      });
      queryClient.invalidateQueries({ queryKey: ["getUsers"], exact: true });
    },
    onError: (error) => {
      console.log("Error creating chat", error);
    },
  });

  return {
    chats,
    isChatsError,
    isFetchingChats,
    refetchChats,
    createUserChat,
    isCreatingChat,
    isCreatingChatError,
  };
};
