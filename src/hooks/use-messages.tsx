import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/constants/query-keys";
import { fetchMessages, createMessage } from "@/services/messages";
import toast from "react-hot-toast";
import { useSocket } from "./use-socket";
import { Message } from "@/types/user";
import { useProfile } from "./use-profile";
import { errorHandler, IError } from "@/utils/responseHandler";

export const useMessages = (chatId: string) => {
  const { socket } = useSocket();
  const { user } = useProfile();
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Fetch initial messages
  const {
    data: initialMessages,
    isError: isMessagesError,
    isLoading: isMessagesLoading,
  } = useQuery({
    queryKey: [MESSAGES.FETCH_MESSAGES, chatId],
    queryFn: () => fetchMessages(chatId),
    enabled: !!chatId,
  });

  // Update local messages when initial fetch completes
  useEffect(() => {
    if (initialMessages) {
      setLocalMessages(initialMessages);
      socket?.emit("join_chat", chatId);
    }
  }, [initialMessages, socket, chatId]);

  // Handle sending messages
  const { mutate: sendMessageMutation, isPending: isSendingMessage } =
    useMutation({
      mutationFn: createMessage,
      onSuccess: (newMessage) => {
        setLocalMessages((prev) => [...prev, newMessage]);
        if (!socket) return console.log("Socket is null");

        // Send the chatId as a string, not the whole chat object
        socket?.emit("new_message", { ...newMessage, chat: chatId });
        setMessage("");
      },
      onError: (error: IError) => {
        toast.error(errorHandler(error));
      },
    });

  const sendMessage = () => {
    if (!message.trim() || !chatId) return;
    sendMessageMutation({ content: message, chatId });
  };

  // Socket event listeners
  useEffect(() => {
    if (!socket || !chatId || !user) return;

    const handleReceiveMessage = (newMessage: Message) => {
      console.log("Message received in hook:", newMessage);
      // Check if the received message belongs to the current chat
      if (newMessage.chat === chatId) {
        setLocalMessages((prev) => {
          // Avoid duplicate messages by checking if the message already exists
          const messageExists = prev.some((msg) => msg._id === newMessage._id);
          if (messageExists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    const handleTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId && data.userId !== user._id) {
        setTypingUsers((prev) =>
          prev.includes(data.userId) ? prev : [...prev, data.userId]
        );
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId && data.userId !== user._id) {
        setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
        // Only set isTyping to false if no users are typing
        setIsTyping((prev) => prev && typingUsers.length > 0);
      }
    };

    // Fix the event name to match server (message_received, not message_recieved)
    socket.on("message_received", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("message_received", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, chatId, user, typingUsers]);

  // Emit typing events
  useEffect(() => {
    if (!socket || !chatId || !user) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
      if (message.trim()) {
        socket.emit("typing", { chatId, userId: user._id });

        // Clear existing timeout
        clearTimeout(typingTimeout);

        // Set new timeout for stop typing
        typingTimeout = setTimeout(() => {
          socket.emit("stop_typing", { chatId, userId: user._id });
        }, 1500);
      } else {
        // If message is empty, stop typing immediately
        socket.emit("stop_typing", { chatId, userId: user._id });
      }
    };

    // Call handleTyping when message changes
    handleTyping();

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [message, socket, chatId, user]);

  return {
    allMessages: localMessages,
    isMessagesError,
    isMessagesLoading,
    sendMessage,
    isSendingMessage,
    message,
    setMessage,
    isTyping,
    typingUsers,
  };
};
