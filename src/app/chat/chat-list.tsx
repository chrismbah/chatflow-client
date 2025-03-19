/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useProfile } from "@/hooks/use-profile";
import Image from "next/image";
import { UseMutateFunction, useQueryClient } from "@tanstack/react-query";
import { Chat } from "@/types";
import moment from "moment";
import { CHATS } from "@/constants/query-keys";

const ChatList = ({
  chats,
  accessChat,
  setCurrentChat,
  currentChat,
  searchChatsQuery,
}: {
  chats: Chat[];
  accessChat: UseMutateFunction<any, Error, string, unknown>;
  setCurrentChat: (payload: any) => void;
  currentChat: Chat | null;
  searchChatsQuery: string;
}) => {
  const { user } = useProfile();
  const queryClient = useQueryClient();

  const accessUserChat = (userId: string) => {
    const cachedChat = queryClient.getQueryData([CHATS.CURRENT_CHAT, userId]);
    if (cachedChat) {
      setCurrentChat(cachedChat);
      console.log("Using cached chat:", cachedChat);
    } else {
      accessChat(userId);
    }
  };

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
            .map((member, i) => {
              const isSelected = currentChat && currentChat._id === chat._id;
              return (
                <div
                  key={`${chat._id}-${member._id}`}
                  onClick={() => accessUserChat(member._id)}
                  className={`mb-2 flex items-center justify-between p-4 bg-transparent rounded-lg transition duration-200 cursor-pointer relative 
                    ${isSelected ? "bg-red-500" : "hover:bg-gray-100/20"}`}
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
                        className="font-semibold truncate"
                        title={member.fullName}
                      >
                        {member.fullName}
                      </p>
                      <p className="text-[12px] truncate text-gray-400 font-normal">
                        {chat.latestMessage?.content ?? "Tap to add new chat"}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 z-2 text-right p-4 flex flex-col items-end">
                    <p className="text-xs text-gray-400">
                      {moment(chat.latestMessage?.createdAt).format("h:mm A") ??
                        ""}
                    </p>
                    <span className="w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white bg-indigo-500">
                      {i + 1}
                    </span>
                  </div>
                </div>
              );
            })
        )
      ) : (
        <p className="px-4 text-center text-sm font-medium text-gray-700">
          Couldn&apos;t find user &ldquo;
          <label className="font-semibold">{searchChatsQuery}</label>&quot;
        </p>
      )}
    </div>
  );
};
export default ChatList;
