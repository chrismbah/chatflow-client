"use client";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdPersonAdd } from "react-icons/io";
import { useProfile } from "@/hooks/use-profile";
import { useChat } from "@/hooks/use-chat";
import ChatList from "./chat-list";
import AddUsersSidePanel from "./add-users-side-bar";
import { ChatSkeleton } from "@/components/ui/skeleton";
import { getUsers } from "@/services/users";
import Navbar from "./navbar";
import { useInfiniteQuery } from "@tanstack/react-query";
import OpenChat from "./open-chat";
import WelcomeChat from "./WelcomeChat";

const Chats = () => {
  const { user, isUserLoading } = useProfile();
  const {
    chatsData,
    isFetchingChats,
    isChatsError,
    accessChat,
    isAccessingChat,
    isAccessingChatError,
    currentChat,
  } = useChat();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const {
    data,
    error: isUsersError,
    isLoading: isFetchingUsers,
    fetchNextPage,
    hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getUsers"],
    queryFn: ({ pageParam = 1 }) => getUsers(pageParam, 10), // Fetch 10 users per page
    initialPageParam: 1, // Set the initial page to 1
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
  });

  const toggleSidePanel = () => {
    setIsSidePanelOpen((prev) => !prev);
  };

  useEffect(() => {
    if (
      user &&
      data &&
      !isFetchingChats &&
      !isChatsError &&
      chatsData.chats &&
      chatsData.chats.length === 0
    ) {
      setIsSidePanelOpen(true);
    }
  }, [chatsData, user, data, isFetchingChats, isChatsError]);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Side Panel */}
      {data && (
        <AddUsersSidePanel
          isSidePanelOpen={isSidePanelOpen}
          setIsSidePanelOpen={setIsSidePanelOpen}
          users={data.pages.flatMap((page) => page.users)} // Flatten the pages into a single array
          isFetchingUsers={isFetchingUsers}
          isUsersError={isUsersError}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          // isFetchingNextPage={isFetchingNextPage}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex">
        <Navbar user={user} isUserLoading={isUserLoading} />

        {/* Chat List Panel */}
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r">
          <header className="flex items-center justify-between p-4 bg-indigo-500 text-white">
            <h1 className="text-lg font-bold">Chats</h1>
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
            ) : chatsData.chats.length > 0 ? (
              <ChatList accessChat={accessChat} chats={chatsData.chats} />
            ) : (
              chatsData.chats.length === 0 && (
                <div className="px-4 text-center text-sm font-medium text-gray-700">
                  No Chats Found. Add a user to start a chat
                </div>
              )
            )}
          </div>
        </aside>
        {currentChat ? (
          <OpenChat currentChat={currentChat} />
        ) : isAccessingChat ? (
          <div>Accessing Chat</div>
        ) : isAccessingChatError ? (
          <div>Couldnt access chat</div>
        ) : (
          <WelcomeChat
            isUserLoading={isUserLoading}
            toggleSidePanel={toggleSidePanel}
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
