import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChat, fetchAllChats } from "@/services/chat";
import toast from "react-hot-toast";
import { responseHandler } from "@/utils/responseHandler";
import { Chat, Message, User } from "@/types";
import { CHATS } from "@/constants/query-keys";
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
    onMutate: (targetUser: User) => {
      console.log("Target User", targetUser);
      setLoadingUsers((prev) => [...prev, targetUser._id]);
      queryClient.setQueryData(
        [CHATS.FETCH_CHATS],
        (oldData: {
          chats: Chat[];
          pagination: {
            currentPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
            limit: number;
            totalChats: number;
            totalPages: number;
          };
        }) => {
          console.log("Old data", oldData);
        }
      );
    },
    onSuccess: (data, targetUser) => {
      // Remove user ID from loading list
      console.log("Success data: ", data);
      console.log("Success target user: ", targetUser);
      setLoadingUsers((prev) => prev.filter((id) => id !== targetUser._id));

      // Invalidate and refetch queries
      queryClient.invalidateQueries({
        queryKey: [CHATS.FETCH_CHATS],
      });
      toast.success(`Chat created with ${targetUser.fullName || "user"}`);
    },
    onError: (error, targetUser) => {
      setLoadingUsers((prev) => prev.filter((id) => id !== targetUser._id));
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
  }, [socket, currentChat]);

  // Watch for changes to currentChat to clear unread messages
  useEffect(() => {
    if (!socket || !currentChat || !user?._id) return;

    // Clear local state for this chat
    setUnreadCounts((prev) => ({ ...prev, [currentChat._id]: 0 }));

    setLatestUnreadMessages((prev) => {
      const newState = { ...prev };
      delete newState[currentChat._id];
      return newState;
    });

    // Tell server user has read messages
    socket.emit("read_messages", {
      chatId: currentChat._id,
      userId: user._id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChat?._id, socket, user?._id]);

  // Calculate total unread count across all chats
  const totalUnreadCount = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const unreadToastShown = useRef(false);

  useEffect(() => {
    if (totalUnreadCount > 0 && !unreadToastShown.current) {
      toast.success(`You have ${totalUnreadCount} unread messages`);
      unreadToastShown.current = true;
      setTimeout(() => (unreadToastShown.current = false), 5000); // Prevent spam
    }
  }, [totalUnreadCount]);

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
