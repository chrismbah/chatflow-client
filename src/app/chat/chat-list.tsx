import React from "react";
import { useProfile } from "@/hooks/use-profile";
import Image from "next/image";
import { UseMutateFunction } from "@tanstack/react-query";
import { Chat } from "@/types/user";

const ChatList = ({
  chats,
  accessChat,
}: {
  chats: Chat[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accessChat: UseMutateFunction<any, Error, string, unknown>;
}) => {
  const { user } = useProfile();
  const accessUserChat = (userId: string) => {
    const res = accessChat(userId);
    console.log("User Chat", res);
  };
  return (
    <div>
      {chats.map((chat) =>
        chat.users
          .filter((member) => member._id !== user?._id) // Exclude the current user
          .map((member, i) => (
            <div
              onClick={() => accessUserChat(member._id)}
              key={member._id}
              className="flex items-center justify-between p-4 hover:bg-gray-100 transition duration-100 cursor-pointer relative"
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
                    className=" font-semibold text-gray-900 truncate"
                    title={member.fullName} // Tooltip for full name
                  >
                    {member.fullName}
                  </p>
                  <p className="text-[12px] truncate italic text-gray-400 font-normal">
                    Tap to start a new chat.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 z-2 text-right p-4  flex flex-col items-end">
                <p className="text-xs text-gray-400">12:{30 + i} PM</p>
                <span className="w-2 h-2 p-2 flex items-center justify-center rounded-full text-xs font-bold text-white bg-indigo-500">
                  {i + 1}
                </span>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default ChatList;
