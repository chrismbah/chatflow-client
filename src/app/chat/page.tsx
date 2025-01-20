"use client";
import React from "react";
import Image from "next/image";
import Add from "@/components/icons/Add";
import Settings from "@/components/icons/Settings";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useProfile } from "@/hooks/use-profile";

const Chats = () => {
  const { user, isLoading, isError } = useProfile();
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-full md:w-1/3 lg:w-1/4 bg-white border-r">
        <header className="flex items-center justify-between p-4 bg-indigo-500 text-white">
          <h1 className="text-lg font-bold">Chat-A-Tive</h1>
          <div className="flex items-center justify-between gap-2">
            <button className="p-2 rounded hover:bg-indigo-400">
              <Add />
            </button>
            <Image
              src={user?.avatar as string}
              alt="Profile"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
          </div>
        </header>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search chats"
            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          <ul>
            <li className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-4">
                <Image
                  src="https://avatar.iran.liara.run/public/boy"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500 truncate">
                    Hey! How are you?
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">12:45 PM</p>
                <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-indigo-500 rounded-full">
                  3
                </span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="flex items-center space-x-4">
            <Image
              src="https://avatar.iran.liara.run/public/boy"
              alt="Profile"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
            <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
          </div>
          <button className="p-2 text-gray-500 rounded hover:bg-gray-100">
            <Settings />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="mb-4 flex">
            <div className="max-w-xs p-3 bg-gray-200 rounded-lg">
              <p className="text-sm text-gray-800">Hi! How’s it going?</p>
            </div>
          </div>
          <div className="mb-4 flex justify-end">
            <div className="max-w-xs p-3 text-white bg-indigo-500 rounded-lg">
              <p className="text-sm">I’m good! How about you?</p>
            </div>
          </div>
        </div>
        <div className="flex items-center p-4 bg-white border-t">
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
  );
};

export default Chats;
