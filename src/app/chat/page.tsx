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
import { useDebounce } from "use-debounce";

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
    setCurrentChat,
  } = useChat();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchChatsQuery, setSearchChatsQuery] = useState("");

  // Debounce search input
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const {
    data,
    error: isUsersError,
    isLoading: isFetchingUsers,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["getUsers", debouncedSearchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getUsers(pageParam, 10, debouncedSearchQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChats = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchChatsQuery(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [debouncedSearchQuery, refetch]);

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
      <AddUsersSidePanel
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        users={data?.pages.flatMap((page) => page.users)}
        isFetchingUsers={isFetchingUsers}
        isUsersError={isUsersError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <div className="flex-1 flex">
        <Navbar user={user} isUserLoading={isUserLoading} />
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
                value={searchChatsQuery}
                onChange={handleSearchChats}
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
            ) : chatsData && chatsData.chats.length > 0 ? (
              <ChatList
                accessChat={accessChat}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                chats={chatsData.chats}
                searchChatsQuery={searchChatsQuery}
              />
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
          <OpenChat key={currentChat._id} currentChat={currentChat} />
        ) : isAccessingChat ? (
          <div>Accessing Chat</div>
        ) : isAccessingChatError ? (
          <div>Couldn&apos;t access chat</div>
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
