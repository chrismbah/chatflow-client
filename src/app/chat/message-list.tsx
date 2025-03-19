"use client";
import { useRef, useEffect } from "react";
import { Message, User } from "@/types";
import MessageItem from "./message-item";
import TypingIndicator from "@/components/ui/TypingIndicator";
import { MessagesSkeleton } from "@/components/ui/skeleton/chat-skeleton";
import ChatBadge from "./chat-badge";

interface MessagesListProps {
  messages: Message[];
  currentUser: User | null;
  receiver: User | null;
  isLoading: boolean;
  isError: boolean;
  isTyping: boolean;
}

const MessagesList = ({
  messages,
  currentUser,
  receiver,
  isLoading,
  isError,
  isTyping,
}: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isTyping]);

  if (isError) {
    return <div className="text-center">Failed to load messages.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar p-4 space-y-3">
      {receiver && !isLoading && <ChatBadge receiver={receiver} />}

      {isLoading ? (
        <MessagesSkeleton count={10} />
      ) : (
        messages.map((message: Message) => (
          <MessageItem
            key={message._id}
            message={message}
            currentUser={currentUser}
            receiver={receiver}
          />
        ))
      )}

      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
