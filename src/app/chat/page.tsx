"use client";
import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import { useChat } from "@/hooks/use-chat";
import ChatList from "./chat-list";
import AddUsersSidePanel from "./add-users-side-bar";
import { ChatSkeleton } from "@/components/ui/skeleton/chat-skeleton";
import OpenChat from "./open-chat";
import WelcomeChat from "./welcome-chat";
import { useUsers } from "@/hooks/use-users";
import { Header } from "./Header";
import ChatSearchBar from "./chat-search-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Chats = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const { user, isUserLoading } = useProfile();

  const {
    users,
    isUsersError,
    isFetchingUsers,
    fetchNextPage,
    hasNextPage,
    refetch,
    searchQuery,
    debouncedSearchQuery,
    handleSearch,
  } = useUsers();

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

  const [searchChatsQuery, setSearchChatsQuery] = useState("");

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
      users.length > 0 &&
      !isFetchingChats &&
      !isChatsError &&
      chatsData.chats &&
      chatsData.chats.length === 0
    ) {
      setIsSidePanelOpen(true);
    }
  }, [chatsData, user, users, isFetchingChats, isChatsError]);

  return (
    <div className="flex h-screen relative bg-[#1b1a1f]">
      <AddUsersSidePanel
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        users={users}
        isFetchingUsers={isFetchingUsers}
        isUsersError={isUsersError}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />

      <div className="flex-1 flex h-screen">
        <aside className="w-full md:w-1/3 lg:w-1/3 border-r px-4 bg-[#1f1f21]">
          <div className="py-4">
            <Header user={user} />
          </div>
          <ChatSearchBar
            searchChatsQuery={searchChatsQuery}
            handleSearchChats={handleSearchChats}
            toggleSidePanel={toggleSidePanel}
          />
          <div className="h-[calc(100vh-180px)] overflow-y-auto hide-scrollbar">
            <Tabs defaultValue="active" className="w-full">
              {/* Tabs List */}
              <TabsList className="grid grid-cols-3 w-full border-0 bg-transparent">
                <TabsTrigger
                  value="active"
                  className="text-white font-bold border-b-2 border-transparent rounded-none hover:bg-white/10 data-[state=active]:border-white data-[state=active]:hover:bg-transparent data-[state=active]:bg-transparent"
                >
                  Active Now
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="text-white font-bold border-b-2 border-transparent rounded-none hover:bg-white/10 data-[state=active]:border-white data-[state=active]:hover:bg-transparent data-[state=active]:bg-transparent"
                >
                  Favorites
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="text-white font-bold border-b-2 border-transparent rounded-none hover:bg-white/10 data-[state=active]:border-white data-[state=active]:hover:bg-transparent data-[state=active]:bg-transparent"
                >
                  All
                </TabsTrigger>
              </TabsList>

              {/* Tabs Content */}
              <div className="overflow-y-auto h-full hide-scrollbar">
                <TabsContent value="active">
                  {isFetchingChats ? (
                    <ChatSkeleton count={10} />
                  ) : isChatsError ? (
                    <ErrorMessage message="Error loading chats." />
                  ) : (
                    <ChatList
                      chats={chatsData.chats}
                      accessChat={accessChat}
                      currentChat={currentChat}
                      setCurrentChat={setCurrentChat}
                      searchChatsQuery={searchChatsQuery}
                    />
                  )}
                </TabsContent>

                <TabsContent value="favorites">
                  <ChatList
                    chats={chatsData.chats}
                    accessChat={accessChat}
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    searchChatsQuery={searchChatsQuery}
                  />
                </TabsContent>

                <TabsContent value="all">
                  <ChatList
                    chats={chatsData.chats}
                    accessChat={accessChat}
                    currentChat={currentChat}
                    setCurrentChat={setCurrentChat}
                    searchChatsQuery={searchChatsQuery}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </aside>

        {currentChat ? (
          <OpenChat
            currentChat={currentChat}
            isAccessingChat={isAccessingChat}
            isAccessingChatError={isAccessingChatError}
          />
        ) : isAccessingChat ? (
          <div className="flex-1 flex items-center justify-center">
            <p>Loading chat...</p>
          </div>
        ) : isAccessingChatError ? (
          <div className="flex-1 flex items-center justify-center">
            <p>Error accessing chat. Please try again.</p>
          </div>
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

// Generic Error Component
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="px-4 text-center text-sm font-medium ">{message}</div>
);
