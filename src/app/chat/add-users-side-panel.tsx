"use client";
import React from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdPersonAdd, IoMdAdd } from "react-icons/io";
import Image from "next/image";
import UsersSkeleton from "@/components/ui/skeleton/UsersSkeleton";
import { useChat } from "@/hooks/use-chat";
import Loader from "@/components/ui/loader/Loader";

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
}: {
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  isFetchingUsers: boolean;
  isUsersError: Error | null;
}) => {
  const { createUserChat, isCreatingChat } = useChat();
  const createAndAddChat = (userId: string) => {
    createUserChat(userId);
  };
  console.log(users);
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
      <div className="p-4">
        <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users"
            className="w-full text-sm bg-transparent border-none focus:outline-none ml-2"
          />
        </div>
        <div className="mt-4">
          {/* Replace with actual user list */}
          {isFetchingUsers ? (
            <UsersSkeleton count={10} />
          ) : isUsersError ? (
            <div className="px-4 text-center text-sm font-medium text-gray-700">
              Error Loading users
            </div>
          ) : users && users.length === 0 ? (
            <div className="px-4 text-center text-sm font-medium text-gray-700">
              No Users Found.
            </div>
          ) : (
            <ul>
              {users &&
                users.map((user, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={user.avatar}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                        width={40}
                        height={40}
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
                      {isCreatingChat ? (
                        <Loader className="w-6 h-6 text-indigo-500" />
                      ) : (
                        <button
                          aria-label="Add User"
                          title="Add User"
                          onClick={() => createAndAddChat(user._id)}
                          disabled={isCreatingChat}
                          className="p-2 rounded hover:bg-gray-100/20"
                        >
                          <IoMdPersonAdd className="w-6 h-6 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUsersSidePanel;
