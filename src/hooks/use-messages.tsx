import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MESSAGES } from "@/constants/query-keys";
import {
  fetchMessages,
  createMessage,
  readMessages,
} from "@/services/messages";
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
    if (!socket || !chatId || !initialMessages) return;
    setLocalMessages(initialMessages);
    socket.emit("join_chat", chatId);
    return () => {
      socket.off("join_chat");
    };
  }, [initialMessages, socket, chatId]);

  // Handle sending messages
  const { mutate: sendMessageMutation, isPending: isSendingMessage } =
    useMutation({
      mutationFn: createMessage,
      onMutate: async (newMessageData) => {
        if (user) {
          const tempMessage: Message = {
            _id: crypto.randomUUID(), // Temporary ID to avoid duplicate keys
            sender: {
              _id: user._id, // Assuming `user` contains the logged-in user info
              fullName: user.fullName,
              avatar: user.avatar,
            },
            content: newMessageData.content,
            chat: chatId, // Ensure this is the chat ID string
            readBy: [user._id],
            status: "pending", // Optimistic pending state
            createdAt: new Date().toISOString(),
          };

          setLocalMessages((prev) => [...prev, tempMessage]);
          return tempMessage; // Return context for rollback in case of failure
        }
      },

      onSuccess: (newMessage, _, tempMessage) => {
        // Optimistically render the chat
        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempMessage._id
              ? { ...newMessage, status: "sent" }
              : msg
          )
        );

        if (!socket) return console.log("Socket is null");
        // Emit the new message
        socket.emit("new_message", { ...newMessage, chat: chatId });
        setMessage("");
      },

      onError: (error: IError, _, tempMessage) => {
        // Remove the optimistically added message if it failed to send
        setLocalMessages((prev) =>
          prev.filter((msg) => msg._id !== tempMessage?._id)
        );
        toast.error(errorHandler(error));
      },
    });
  const { mutate: readMessageMutation } = useMutation({
    mutationFn: readMessages,
    onSuccess: () => {
      toast.success("All Messages have been read");
    },
    onError: (error: IError) => {
      toast.error(errorHandler(error));
    },
  });
  useEffect(() => {
    if (!socket || !chatId || !user) return;
    // Use Intersection Observer to detect when messages are visible
    const observer = new IntersectionObserver(
      (entries) => {
        // If any unread message becomes visible
        if (entries.some((entry) => entry.isIntersecting)) {
          // Mark messages as read
          socket.emit("read_messages", { chatId, userId: user._id });
          toast.error("Entries works");

          //! readMessageMutation({ chatId });
        } else {
          toast.error("Something went wrong with entries");
        }
      },
      { threshold: 0.5 } // 50% visible
    );

    // Get message elements
    const messageElements = document.querySelectorAll(".message-item");
    messageElements.forEach((el) => observer.observe(el));

    return () => {
      messageElements.forEach((el) => observer.unobserve(el));
    };
  }, [socket, chatId, user, localMessages.length]);

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
        setIsTyping(false);
      }
    };
    const handleReadMessages = ({
      chatId: receivedChatId,
      userId: readByUserId,
    }: {
      chatId: string;
      userId: string;
    }) => {
      if (receivedChatId !== chatId) return;

      // Update read status for messages - only when another user has read them
      if (readByUserId !== user._id) {
        setLocalMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.readBy.includes(readByUserId)
              ? msg
              : {
                  ...msg,
                  readBy: [...msg.readBy, readByUserId],
                  status: "received",
                }
          )
        );
        toast.success("Just updated the state");
      } else {
        toast.error("Someting is wrong");
      }
    };

    // Fix the event name to match server (message_received, not message_recieved)
    socket.on("message_received", handleReceiveMessage);
    socket.on("messages_read", handleReadMessages);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("message_received", handleReceiveMessage);
      socket.off("messages_read", handleReadMessages);
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
