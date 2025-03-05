"use client";
import { FiSearch, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { Chat } from "@/types/user";
import { useProfile } from "@/hooks/use-profile";
import Image from "next/image";
const OpenChat = ({ currentChat }: { currentChat: Chat }) => {
  const { user, isUserLoading } = useProfile();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  // Find the other user in the chat
  const reciever = currentChat.users.find((u) => u._id !== user._id);

  if (!reciever) {
    return <div>Chat data is invalid.</div>; // Handle the case where the other user is not found
  }

  return (
    <main className="flex-1 flex flex-col">
      {/* Chat Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow">
        <div className="flex items-center space-x-4">
          <FiArrowLeft className="w-5 h-5 text-gray-500 sm:hidden" />
          <Image
            src={reciever.avatar}
            alt={reciever.fullName}
            width={40}
            height={40}
            className="rounded-full"
            priority // Ensures it loads fast
          />
          <h2 className="text-lg font-semibold text-gray-900">
            {reciever.fullName}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <FiSearch className="w-5 h-5 text-gray-500" />
          <FiMoreVertical className="w-5 h-5 text-gray-500" />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* Example Received Message */}
        <div className="mb-4 flex">
          <div className="max-w-xs p-3 bg-gray-200 rounded-lg">
            <p className="text-sm text-gray-800">Hi! How’s it going?</p>
          </div>
        </div>
        {/* Example Sent Message */}
        <div className="mb-4 flex justify-end">
          <div className="max-w-xs p-3 text-white bg-indigo-500 rounded-lg">
            <p className="text-sm">I’m good! How about you?</p>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-4 bg-white border-t">
        <BsEmojiSmile className="w-6 h-6 text-gray-500" />
        <AiOutlinePaperClip className="w-6 h-6 text-gray-500 mx-2" />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="p-2 ml-4 flex items-center justify-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-400">
          <IoPaperPlaneOutline className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
};

export default OpenChat;
