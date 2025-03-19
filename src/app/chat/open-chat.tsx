"use client";
import { useMemo } from "react";
import { Chat } from "@/types";
import { useProfile } from "@/hooks/use-profile";
import { useMessages } from "@/hooks/use-messages";
import { OpenChatHeader } from "./open-chat-header";
import MessagesList from "./message-list";
import MessageInput from "./message-input";

const OpenChat = ({ currentChat }: { currentChat: Chat }) => {
  const chatId = currentChat?._id ?? "";
  const { user } = useProfile();

  const {
    allMessages,
    isMessagesError,
    isMessagesLoading,
    sendMessage,
    message,
    setMessage,
    isTyping,
  } = useMessages(chatId);

  // Memoize the receiver to prevent unnecessary re-renders
  const receiver = useMemo(() => {
    if (!currentChat || !user) return null;
    return currentChat.users.find((u) => u._id !== user._id);
  }, [currentChat, user]);


  return (
    <main className="flex-1 flex flex-col">
      {receiver && <OpenChatHeader receiver={receiver} />}

      <MessagesList
        messages={allMessages}
        currentUser={user}
        receiver={receiver || null}
        isLoading={isMessagesLoading}
        isError={isMessagesError}
        isTyping={isTyping}
      />

      <MessageInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </main>
  );
};

export default OpenChat;
