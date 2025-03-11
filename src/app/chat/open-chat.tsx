"use client";
import { useEffect, useRef } from "react";
import { FiSearch, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { Chat, Message } from "@/types/user";
import { useProfile } from "@/hooks/use-profile";
import { useMessages } from "@/hooks/use-messages";
import Image from "next/image";
import TypingIndicator from "@/components/ui/TypingIndicator"; // Import the new component

const OpenChat = ({ currentChat }: { currentChat: Chat }) => {
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
    // typingUsers,
  } = useMessages(currentChat._id);

  // Auto-scroll to bottom when messages change or when typing starts/stops
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  // Function to handle message sending
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
    <main className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 font-medium">
            <p className="text-lg ">No messages yet</p>
            <p className="text-sm">Start typing to begin the conversation</p>
          </div>
        ) : (
          <>
            {allMessages.map((message: Message) => {
              const isSender = message.sender._id === user._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      isSender
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-4 bg-white border-t">
        <BsEmojiSmile className="w-6 h-6 text-gray-500" />
        <AiOutlinePaperClip className="w-6 h-6 text-gray-500 mx-2" />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send on Enter
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 ml-4 flex items-center justify-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-400 disabled:bg-indigo-300"
        >
          <IoPaperPlaneOutline className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};

export default OpenChat;
