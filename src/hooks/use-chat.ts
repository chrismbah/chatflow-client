import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat, fetchAllChats } from "@/services/chat";
import toast from "react-hot-toast";
import { responseHandler } from "@/utils/responseHandler";
import { Chat, Message } from "@/types";
import { CHATS, USERS } from "@/constants/query-keys";
import { useSocket } from "./use-socket";
import { useProfile } from "./use-profile";

export const useChat = () => {
  const [loadingUsers, setLoadingUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [latestUnreadMessages, setLatestUnreadMessages] = useState<
    Record<string, Message>
  >({});
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { user } = useProfile();

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

  // Listen for unread message counts
  useEffect(() => {
    if (!socket) return;

    const handleUnreadCounts = (counts: Record<string, number>) => {
      setUnreadCounts((prev) => ({
        ...prev,
        ...counts,
      }));
    };

    const handleLatestUnreadMessages = (messages: Record<string, Message>) => {
      setLatestUnreadMessages((prev) => ({ ...prev, ...messages }));
    };

    socket.on("unread_messages_count", handleUnreadCounts);
    socket.on("latest_unread_messages", handleLatestUnreadMessages);

    return () => {
      socket.off("unread_messages_count", handleUnreadCounts);
      socket.off("latest_unread_messages", handleLatestUnreadMessages);
    };
  }, [socket, currentChat, latestUnreadMessages, unreadCounts]);

  // Watch for changes to currentChat to clear unread messages
  useEffect(() => {
    if (!socket || !currentChat || !user?._id) return;
    
    // Clear local state for this chat
    setUnreadCounts(prev => ({ ...prev, [currentChat._id]: 0 }));
    
    setLatestUnreadMessages(prev => {
      const newState = { ...prev };
      delete newState[currentChat._id];
      return newState;
    });
  
    // Tell server user has read messages
    socket.emit("read_messages", {
      chatId: currentChat._id,
      userId: user._id,
    });
    
  }, [currentChat, socket, user]);

  // Calculate total unread count across all chats
  const totalUnreadCount = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

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
    unreadCounts,
    latestUnreadMessages,
    totalUnreadCount,
  };
};
