import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";
import { Button } from "../button";

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
    <li key={index} className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-[35px] w-[35px] rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-2 w-13" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};

export const UsersSkeleton = ({ count }: UsersSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <li key={index} className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-32 " />
          <Skeleton className="h-2.5 w-48 " />
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-primary/10"
      >
        <UserPlus className="h-4 w-4 text-primary" />
      </Button>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};

export const MessagesSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {[...Array(count)].map((_, i) => {
        const isSender = i % 2 === 0;

        return (
          <div
            key={i}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`flex items-end ${
                isSender ? "flex-row-reverse" : "flex-row"
              } gap-2`}
            >
              <Skeleton className="w-8 h-8 rounded-full" />
              <div
                className={`flex flex-col gap-1 ${
                  isSender ? "items-end" : "items-start"
                }`}
              >
                <Skeleton
                  className={`relative max-w-[75%] h-[32px] p-2 rounded-none rounded-t-lg bg-[#2c2b31] ${
                    isSender ? "rounded-bl-lg w-44" : "rounded-br-lg w-48"
                  }`}
                />
                <Skeleton className="w-8 h-2 mt-1 rounded-sm" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
