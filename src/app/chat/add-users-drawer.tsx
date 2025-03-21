"use client";
import React, { useState } from "react";
import { UsersSkeleton } from "@/components/ui/skeleton/chat-skeleton";
import { useChat } from "@/hooks/use-chat";
import Loader from "@/components/ui/loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "@/types";
import { UserPlus, CheckCircle, X, GripHorizontal, Search } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AddUsersCornerDrawer = ({
  users,
  isFetchingUsers,
  isUsersError,
  fetchNextPage,
  hasNextPage,
  searchQuery,
  handleSearch,
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  users?: User[];
  isFetchingUsers: boolean;
  isUsersError: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}) => {
  const { createUserChat, loadingUsers } = useChat();
  const [addedUsers, setAddedUsers] = useState<Set<string>>(new Set());

  const createAndAddChat = async (userId: string) => {
    createUserChat(userId);
    setAddedUsers((prev) => new Set(prev).add(userId)); // Mark user as added
  };

  return (
    <>
      {/* Floating action button always visible */}
      {!isSidebarOpen && (
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 z-40"
          onClick={() => setIsSidebarOpen(true)}
        >
          <UserPlus className="h-5 w-5" />
        </Button>
      )}

      {/* Custom drawer without SheetContent overlay */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 w-[30%] h-[70vh] hide-scrollbar transform transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <Card className="h-full hide-scrollbar rounded-t-xl border border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium">Add Users</CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                {users?.length ?? 0} found
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 text-muted-foreground cursor-grab" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 h-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <CardContent className="p-0 pt-1 h-[calc(70vh-120px)]">
            <div
              id="user-list-container"
              className="h-full overflow-y-auto custom-scrollbar pr-1"
            >
              {isFetchingUsers ? (
                <div className="px-3">
                  <UsersSkeleton count={5} />
                </div>
              ) : isUsersError ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Error loading users
                </div>
              ) : users && users.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto bg-muted rounded-full h-12 w-12 flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium">No users found</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try a different search term
                  </p>
                </div>
              ) : (
                users && (
                  <InfiniteScroll
                    dataLength={users.length}
                    next={fetchNextPage}
                    hasMore={hasNextPage}
                    loader={<UsersSkeleton count={1} />}
                    scrollableTarget="user-list-container"
                  >
                    <ul className="space-y-1 p-2">
                      {users.map((user, index) => (
                        <li
                          key={index}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-md transition-colors",
                            "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={user.avatar}
                                alt={user.fullName}
                              />
                              <AvatarFallback>
                                {user.fullName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium leading-none">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {loadingUsers.includes(user._id) ? (
                            <Loader className="h-5 w-5 text-primary" />
                          ) : addedUsers.has(user._id) ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-primary/10"
                              onClick={() => createAndAddChat(user._id)}
                              disabled={loadingUsers.includes(user._id)}
                            >
                              <UserPlus className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </InfiniteScroll>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional click-outside handler */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AddUsersCornerDrawer;
