"use client";

import { useEffect, useRef } from "react";
import { FiSearch, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoTimeOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { Chat, Message } from "@/types/user";
import { useProfile } from "@/hooks/use-profile";
import { useMessages } from "@/hooks/use-messages";
import Image from "next/image";
import TypingIndicator from "@/components/ui/TypingIndicator";
import moment from "moment";

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
    <main className="flex-1 flex flex-col bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <FiArrowLeft className="w-5 h-5 text-gray-500 sm:hidden" />
          <Image
            src={receiver.avatar}
            alt={receiver.fullName}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <h2 className="text-lg font-semibold text-gray-900">
            {receiver.fullName}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <FiSearch className="w-5 h-5 text-gray-500" />
          <FiMoreVertical className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className=" bg-yellow-200 text-gray-700 text-sm font-medium text-center p-6 mx-auto max-w-[640px] shadow-sm rounded-lg h">
          Welcome to your chat with {receiver.fullName}. <br />. Please keep to
          community standards and have a great conversation!
        </div>
        {allMessages.map((message: Message) => {
          const isSender = message.sender._id === user._id;
          return (
            <div
              key={message._id}
              className={`flex message-item ${
                isSender ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`relative max-w-xs p-2 rounded-lg ${
                  isSender
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center ${
                    isSender ? "justify-end" : "justify-start"
                  }  space-x-1 mt-1 text-[10px]`}
                >
                  <span
                    className={`${
                      isSender ? "text-blue-100 mr-1" : "text-gray-500 ml-1"
                    }`}
                  >
                    {moment(message.createdAt).format("h:mm A")}
                  </span>
                  {isSender && (
                    <>
                      {message.status === "pending" ? (
                        <IoTimeOutline className="w-3 h-3 text-white" />
                      ) : message.status === "sent" || !message.readBy.includes(receiver._id) ? (
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
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-4 bg-white border-t">
        <BsEmojiSmile className="w-6 h-6 text-gray-500" />
        <AiOutlinePaperClip className="w-6 h-6 text-gray-500 mx-2" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Write a Message!"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 ml-4 flex items-center justify-center text-white bg-blue-500 rounded-full hover:bg-blue-400 disabled:bg-blue-300"
        >
          <IoPaperPlaneOutline className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};

export default OpenChat;
