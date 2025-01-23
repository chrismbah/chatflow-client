import React from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/use-profile";

interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
}

interface Chat {
  _id: string;
  users: User[];
}

const ChatList = ({ chats }: { chats: Chat[] }) => {
  const { user } = useProfile();

  return (
    <ul>
      {chats.map((chat) =>
        chat.users
          .filter((member) => member._id !== user?._id) // Exclude the current user
          .map((member, i) => (
            <li
              key={member._id}
              className="flex items-center justify-between p-4 hover:bg-gray-100 transition duration-100 cursor-pointer relative"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={member.avatar}
                  alt={member.fullName}
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
                <div className="flex flex-col w-[65%]">
                  <p
                    className=" font-semibold text-gray-900 truncate"
                    title={member.fullName} // Tooltip for full name
                  >
                    {member.fullName}
                  </p>
                  <p
                    className="text-sm text-gray-500 truncate"
                    title={`Hey I'm ${member.fullName}. What's your name?`} // Tooltip for message
                  >
                    {`Hey I'm ${member.fullName}. What's your name?`}
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 z-2 text-right p-4  flex flex-col items-end">
                <p className="text-xs text-gray-400">12:{30 + i} PM</p>
                <span className="w-2 h-2 p-2 flex items-center justify-center rounded-full text-xs font-bold text-white bg-indigo-500">
                  {i + 1}
                </span>
              </div>
            </li>
          ))
      )}
    </ul>
  );
};

export default ChatList;
