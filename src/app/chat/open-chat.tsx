"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoTimeOutline,
  IoPaperPlane,
} from "react-icons/io5";
import { Chat, Message, User } from "@/types";
import { useProfile } from "@/hooks/use-profile";
import { useMessages } from "@/hooks/use-messages";
import TypingIndicator from "@/components/ui/TypingIndicator";
import moment from "moment";
import { OpenChatHeader, OpenChatHeaderSkeleton } from "./open-chat-header";
import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { MessagesSkeleton } from "@/components/ui/skeleton/chat-skeleton";

const OpenChat = ({
  currentChat,
  isAccessingChat,
  isAccessingChatError,
}: {
  currentChat: Chat | null;
  isAccessingChat: boolean;
  isAccessingChatError: boolean;
}) => {
  // Ensure chatId is always a string, never undefined
  const chatId = currentChat?._id ?? "";
  const { user } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isMessagesLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages, isMessagesLoading, isTyping, messagesEndRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage();
    // Close emoji picker after sending a message
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    // Don't close the picker here to allow multiple emoji selections
  };

  // Early returns for error states
  // if (!user) return <div className="text-center">User not found.</div>;
  if (isMessagesError)
    return <div className="text-center">Failed to load messages.</div>;
  if (isAccessingChatError)
    return <div className="text-center">Failed to access chat.</div>;

  // Handle message status display in a cleaner way
  const getMessageStatusIcon = (message: Message, receiverId?: string) => {
    if (!receiverId || message.sender._id !== user?._id) return null;

    if (message.status === "pending") {
      return <IoTimeOutline className="w-3 h-3 text-white" />;
    } else if (message.readBy.includes(receiverId)) {
      return <IoCheckmarkDone className="w-3 h-3 text-white" />;
    } else {
      return <IoCheckmark className="w-3 h-3 text-white" />;
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {isAccessingChat || !receiver ? (
        <OpenChatHeaderSkeleton />
      ) : (
        <OpenChatHeader receiver={receiver} />
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar p-4 space-y-3">
        {receiver && <ChatBadge receiver={receiver} />}
        {isMessagesLoading ? (
          <MessagesSkeleton count={10} />
        ) : (
          allMessages.map((message: Message) => {
            const isSender = message.sender._id === user?._id;
            return (
              <div
                key={message._id}
                className={`flex message-item ${
                  isSender ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`flex items-end ${
                    isSender ? "flex-row-reverse" : "flex-row"
                  } gap-2`}
                >
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image
                      src={message.sender.avatar}
                      alt={message.sender.fullName}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div
                    className={`flex flex-col gap-1 ${
                      isSender ? "items-end" : "items-start"
                    } `}
                  >
                    <div
                      className={`relative max-w-xs p-2 break-words rounded-t-lg ${
                        isSender
                          ? "bg-[#2c2b31] rounded-bl-lg"
                          : "bg-gradient-to-r from-[#4338ca] to-[#6366f1] via-[#4f46e5] rounded-br-lg"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`text-[11px] ${
                          isSender ? "text-white mr-1" : "text-gray-100"
                        }`}
                      >
                        {moment(message.createdAt).format("h:mm A")}
                      </div>
                      {receiver && getMessageStatusIcon(message, receiver._id)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-4 relative">
        <div className="relative flex-1">
          <button
            type="button"
            aria-label="Open emoji picker"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <BsEmojiSmile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-0 mb-2 z-10"
            >
              <EmojiPicker theme={"dark"} onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Write a message..."
            className="hide-scrollbar w-full placeholder:text-[#4e4f55] px-16 py-5 bg-[#26262e] h-[70px] flex items-center justify-center border rounded-lg focus:outline-none focus:ring-0 resize-none"
            rows={1}
            aria-label="Message input"
          ></textarea>
          <button
            type="button"
            aria-label="Attach file"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            <AiOutlinePaperClip className="w-6 h-6" />
          </button>
        </div>
        <button
          onClick={handleSendMessage}
          className="p-4 ml-4 bg-gradient-to-br from-[#6365f132] to-[#4e46e52c] bg-opacity-10 rounded-full"
          aria-label="Send message"
          disabled={!message.trim()}
        >
          <div className="p-2 flex items-center justify-center text-white bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-full">
            <IoPaperPlane className="w-5 h-5" />
          </div>
        </button>
      </div>
    </main>
  );
};

export default OpenChat;

const ChatBadge = ({ receiver }: { receiver: User }) => {
  return (
    <div className="bg-[#26262ec5] backdrop-blur-lg shadow-xl text-sm font-medium text-center p-6 mx-auto max-w-[640px] rounded-lg text-gray-300">
      You are now chatting with {receiver.fullName} <br /> Please keep to
      community standards and have a great conversation!
    </div>
  );
};
