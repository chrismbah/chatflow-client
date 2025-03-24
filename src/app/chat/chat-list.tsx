/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { Chat, Message, User } from "@/types";
import moment from "moment";

const ChatList = ({
  chats,
  setCurrentChat,
  currentChat,
  searchChatsQuery,
  unreadCounts,
  latestUnreadMessages,
  user,
}: {
  chats: Chat[];
  setCurrentChat: (payload: any) => void;
  currentChat: Chat | null;
  searchChatsQuery: string;
  unreadCounts: Record<string, number>;
  latestUnreadMessages: Record<string, Message>;
  user: User | null;
}) => {
  // Filter chats based on searchChatsQuery
  const filteredChats = chats?.filter(
    (chat) =>
      chat.users &&
      chat.users.some(
        (member) =>
          member?._id !== user?._id &&
          member?.fullName
            ?.toLowerCase()
            .includes(searchChatsQuery.toLowerCase())
      )
  );

  return (
    <div className="py-2">
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) =>
          chat.users
            ?.filter((member) => member._id !== user?._id)
            .map((member) => {
              const isSelected = currentChat && currentChat._id === chat._id;
              const unreadCount = unreadCounts[chat._id] || 0;

              // Choose which message to display - either the latest unread or the chat's latest message
              const latestUnreadMessage = latestUnreadMessages[chat._id];
              const displayMessage =
                latestUnreadMessage?.content ||
                chat.latestMessage?.content ||
                "Tap to add new chat";

              // Choose which timestamp to display
              const messageTime =
                latestUnreadMessage?.createdAt || chat.latestMessage?.createdAt;
              const formattedTime = messageTime
                ? moment(messageTime).format("h:mm A")
                : "";

              return (
                <div
                  key={`${chat._id}-${member._id}`}
                  onClick={() => setCurrentChat(chat)}
                  className={`mb-2 flex items-center justify-between p-4 rounded-lg transition duration-200 cursor-pointer relative 
                    ${isSelected ? "bg-gray-100/10" : "hover:bg-gray-100/5"}`}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={member.avatar}
                      alt={member.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex flex-col w-[65%]">
                      <p
                        className={`font-semibold truncate ${
                          unreadCount > 0 && !isSelected
                            ? "text-indigo-400"
                            : ""
                        }`}
                        title={member.fullName}
                      >
                        {member.fullName}
                      </p>
                      <p
                        className={`text-[12px] truncate ${
                          unreadCount > 0 && !isSelected
                            ? "text-gray-700 font-medium"
                            : "text-gray-400 font-normal"
                        }`}
                      >
                        {displayMessage}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 z-2 text-right p-4 flex flex-col items-end">
                    <p className="text-xs text-gray-400">{formattedTime}</p>
                    {unreadCount > 0 && !isSelected ? (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white bg-indigo-500">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })
        )
      ) : (
        <p className="px-4 text-center text-sm font-medium">
          Could&apos;nt find user &quot;{" "}
          <label className="font-semibold">{searchChatsQuery}</label>&quot;
        </p>
      )}
    </div>
  );
};

export default ChatList;
