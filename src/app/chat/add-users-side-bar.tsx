/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdPersonAdd, IoMdAdd } from "react-icons/io";
import { UsersSkeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/use-chat";
import Loader from "@/components/ui/loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

export interface User {
  _id: string;
  fullName: string;
  avatar: string;
  email: string;
}

const AddUsersSidePanel = ({
  isSidePanelOpen,
  setIsSidePanelOpen,
  users,
  isFetchingUsers,
  isUsersError,
  fetchNextPage,
  hasNextPage,
}: // isFetchingNextPage,
{
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  isFetchingUsers: boolean;
  isUsersError: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  // isFetchingNextPage: boolean;
}) => {
  const { createUserChat, loadingUsers } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const createAndAddChat = (userId: string) => {
    createUserChat(userId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce or trigger search API call here if needed
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 w-80 ${
        isSidePanelOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="flex items-center justify-between p-4 bg-indigo-500 text-white">
        <h2 className="text-lg font-bold">Add Users</h2>
        <button
          onClick={() => setIsSidePanelOpen(false)}
          className="text-white p-2 hover:bg-indigo-400 rounded"
        >
          <IoMdAdd className="w-6 h-6 transform rotate-45" />
        </button>
      </header>
      <div className="h-full flex flex-col">
        {/* Search Input */}
        <div className="p-4">
          <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users"
              className="w-full text-sm bg-transparent border-none focus:outline-none ml-2"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* User List */}
        <div
          id="user-list-container"
          className="flex-1 overflow-y-auto hide-scrollbar"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          {isFetchingUsers ? (
            <UsersSkeleton count={10} />
          ) : isUsersError ? (
            <div className="px-4 text-center text-sm font-medium text-gray-700">
              Error Loading users
            </div>
          ) : users.length === 0 ? (
            <div className="px-4 text-center text-sm font-medium text-gray-700">
              No Users Found.
            </div>
          ) : (
            <InfiniteScroll
              dataLength={users.length} // Total number of items loaded so far
              next={fetchNextPage} // Function to load more data
              hasMore={hasNextPage} // Boolean to indicate if there are more items to load
              loader={
                <div className="px-4">
                  <UsersSkeleton count={1} />
                </div>
              }
              // endMessage={
              //   <div className="px-4 text-center text-sm font-medium text-gray-700">
              //     No more users to load.
              //   </div>
              // }
              scrollableTarget="user-list-container" // Add this to target the scrollable container
            >
              <ul>
                {users.map((user, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-100 transition duration-100 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-gray-900">
                          {user.fullName}
                        </p>{" "}
                        <p className="font-light text-gray-400 text-[12px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {loadingUsers.includes(user._id) ? (
                        <div className="p-2">
                          <Loader className="w-6 h-6 text-indigo-500" />
                        </div>
                      ) : (
                        <button
                          onClick={() => createAndAddChat(user._id)}
                          disabled={loadingUsers.includes(user._id)}
                          className="p-2 rounded hover:bg-gray-100/20"
                        >
                          <IoMdPersonAdd className="w-6 h-6 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUsersSidePanel;
