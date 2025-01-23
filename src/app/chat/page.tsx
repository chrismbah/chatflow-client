"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiSearch,
  FiSettings,
  FiArrowLeft,
  FiMoreVertical,
} from "react-icons/fi";
import { AiOutlineMessage, AiOutlinePaperClip } from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { useProfile } from "@/hooks/use-profile";
import { useChat } from "@/hooks/use-chat";
import ChatList from "./chat-list";
import AddUsersSidePanel from "./add-users-side-panel";
import AvatarSkeleton from "@/components/ui/Skeleton/AvatarSkeleton";
import ChatSkeleton from "@/components/ui/skeleton/ChatSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";
import Link from "next/link";

const Chats = () => {
  const { user, isUserLoading } = useProfile();
  const { chats, isFetchingChats, isChatsError } = useChat();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const {
    data: users,
    error: isUsersError,
    isLoading: isFetchingUsers,
  } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
  });

  const toggleSidePanel = () => {
    setIsSidePanelOpen((prev) => !prev);
  };

  useEffect(() => {
    if (user && chats && chats.length === 0) {
      setIsSidePanelOpen(true);
    }
  }, [chats, user]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Side Panel */}
      <AddUsersSidePanel
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        users={users}
        isFetchingUsers={isFetchingUsers}
        isUsersError={isUsersError}
      />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Navigation Bar */}
        <aside className="hidden sm:flex flex-col items-center w-14 bg-white border-r py-4 space-y-6">
          {isUserLoading ? (
            <AvatarSkeleton />
          ) : (
            user && (
              <Image
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={40}
                height={40}
              />
            )
          )}
          <button
            title="Chats"
            className="relative p-2 rounded hover:bg-gray-100"
          >
            <AiOutlineMessage className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
          <button
            title="Create Group"
            className="relative p-2 rounded hover:bg-gray-100"
          >
            <MdOutlineGroupAdd className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
          </button>
          <button title="Settings" className="p-2 rounded hover:bg-gray-100">
            <FiSettings className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
          </button>
        </aside>

        {/* Chat List Panel */}
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r">
          <header className="flex items-center justify-between p-4 bg-indigo-500 text-white">
            <Link href="/" className="text-lg font-bold">
              Chat-A-Tive
            </Link>
            <button
              aria-label="Add User"
              title="Add User"
              onClick={toggleSidePanel}
              className="p-2 rounded hover:bg-gray-100/20"
              disabled={isUserLoading}
            >
              <IoMdPersonAdd className="w-6 h-6 text-white" />
            </button>
          </header>
          <div className="p-4">
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search chats"
                className="w-full text-sm bg-transparent border-none focus:outline-none ml-2"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {isFetchingChats ? (
              <ChatSkeleton count={7} />
            ) : isChatsError ? (
              <div className="px-4 text-center text-sm font-medium text-gray-700">
                Error Loading Chats.
              </div>
            ) : chats.length > 0 ? (
              <ChatList chats={chats} />
            ) : (
              chats.length === 0 && (
                <div className="px-4 text-center text-sm font-medium text-gray-700">
                  No Chats Found. Add a user to start a chat
                </div>
              )
            )}
          </div>
        </aside>

        {/* Open Chat Panel */}
        <main className="flex-1 flex flex-col">
          {/* Chat Header */}
          <header className="flex items-center justify-between p-4 bg-white shadow">
            <div className="flex items-center space-x-4">
              <FiArrowLeft className="w-5 h-5 text-gray-500 sm:hidden" />
              <Image
                src="https://avatar.iran.liara.run/public/boy"
                alt="Profile"
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
            </div>
            <div className="flex items-center space-x-4">
              <FiSearch className="w-5 h-5 text-gray-500" />
              <FiMoreVertical className="w-5 h-5 text-gray-500" />
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Received Message */}
            <div className="mb-4 flex">
              <div className="max-w-xs p-3 bg-gray-200 rounded-lg">
                <p className="text-sm text-gray-800">Hi! How’s it going?</p>
              </div>
            </div>
            {/* Sent Message */}
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
      </div>
    </div>
  );
};

export default Chats;
