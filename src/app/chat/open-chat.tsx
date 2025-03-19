"use client";

import { useEffect, useRef } from "react";
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
import OpenChatHeader from "./open-chat-header";
import Image from "next/image";

const OpenChat = ({ currentChat }: { currentChat: Chat }) => {
  const chatId = currentChat._id;
  const { user, isUserLoading } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    allMessages,
    isMessagesError,
    isMessagesLoading,
    sendMessage,
    message,
    setMessage,
    isTyping,
  } = useMessages(chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage();
  };

  if (isUserLoading || isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );
  }

  if (!user) return <div className="text-center">User not found.</div>;
  if (isMessagesError)
    return <div className="text-center">Failed to load messages.</div>;

  const receiver = currentChat.users.find((u) => u._id !== user._id);
  if (!receiver)
    return <div className="text-center">Chat data is invalid.</div>;

  return (
    <main className="flex-1 flex flex-col ">
      <OpenChatHeader receiver={receiver} />
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar p-4 space-y-3">
        <ChatBadge receiver={receiver} />
        {allMessages.map((message: Message) => {
          const isSender = message.sender._id === user._id;
          return (
            <div
              key={message._id}
              className={`flex message-item  ${
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
                    <div
                      className={`flex items-center ${
                        isSender ? "justify-end" : "justify-start"
                      }  space-x-1 mt-1 text-[10px]`}
                    ></div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`text-[11px] ${
                        isSender ? "text-white mr-1" : "text-gray-100"
                      }`}
                    >
                      {moment(message.createdAt).format("h:mm A")}
                    </div>
                    {isSender && (
                      <>
                        {message.status === "pending" ? (
                          <IoTimeOutline className="w-3 h-3 text-white" />
                        ) : message.status === "sent" ||
                          !message.readBy.includes(receiver._id) ? (
                          <IoCheckmark className="w-3 h-3 text-white" />
                        ) : message.readBy.includes(receiver._id) ||
                          message.status === "received" ? (
                          <IoCheckmarkDone className="w-3 h-3 text-white" />
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center p-4">
        <div className="relative flex-1">
          {/* Emoji Icon - Absolute Left */}
          <BsEmojiSmile className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

          {/* Text Area */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            placeholder="Write a message..."
            className="hide-scrollbar w-full placeholder:text-[#4e4f55] px-16 py-5 bg-[#26262e] h-[70px] flex items-center justify-center border rounded-lg focus:outline-none focus:ring-0 resize-none"
            rows={1}
          ></textarea>
          <AiOutlinePaperClip className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 cursor-pointer" />
        </div>
        <button  onClick={handleSendMessage} className="p-4 ml-4 bg-gradient-to-br from-[#6365f132] to-[#4e46e52c] bg-opacity-10 rounded-full">
          <div
            onClick={handleSendMessage}
            className="p-2 flex items-center justify-center text-white bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-full disabled:bg-blue-300"
          >
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
