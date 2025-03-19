import React from "react";
import { IoMdPersonAdd } from "react-icons/io"; // Assuming you want the same icon for the button

interface ChatSkeletonProps {
  count: number; // Number of skeletons to display
}

interface UsersSkeletonProps {
  count: number; // Number of skeletons to display
}

export const AvatarSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className="animate-pulse">
      <svg
        className={`w-8 h-8 text-gray-200 ${className}`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
      </svg>
    </div>
  );
};

export const ChatSkeleton = ({ count }: ChatSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <li
      key={index}
      className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer animate-pulse"
    >
      <div className="flex items-center space-x-4">
        {/* Avatar Skeleton */}
        <AvatarSkeleton className="rounded-full" />

        <div className="flex-1 space-y-2">
          {/* Name Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32"></div>

          {/* Message Skeleton */}
          <div className="h-3 bg-gray-300 rounded w-48"></div>
        </div>
      </div>

      <div className="text-right space-y-2">
        {/* Time Skeleton */}
        <div className="h-2 bg-gray-300 rounded w-12"></div>

        {/* Badge Skeleton */}
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};

export const UsersSkeleton = ({ count }: UsersSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <li
      key={index}
      className="flex items-center justify-between py-4 cursor-pointer animate-pulse"
    >
      <div className="flex items-center space-x-4">
        {/* Avatar Skeleton */}
        <AvatarSkeleton className="rounded-full" />

        <div className="flex flex-col gap-1">
          {/* Name Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32"></div>

          {/* Email Skeleton */}
          <div className="h-3 bg-gray-300 rounded w-48"></div>
        </div>
      </div>

      <div className="text-right">
        {/* Button Skeleton */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <IoMdPersonAdd className="w-[26px] h-[26px] text-gray-300" />
        </div>
      </div>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};
