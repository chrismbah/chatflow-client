import { User } from "@/types";
import React from "react";
import { FiSearch, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import Image from "next/image";

interface OpenChatHeaderProps {
  receiver: User;
}
export const OpenChatHeader = ({ receiver }: OpenChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-4 py-6 border-b border-[#232227]">
      <div className="flex items-center space-x-4">
        <FiArrowLeft className="w-5 h-5 text-gray-500 sm:hidden" />
        <div className="relative w-[55px] h-[55px]">
          <Image
            src={receiver.avatar}
            alt={receiver.fullName}
            width={55}
            height={55}
            className="rounded-full h-full object-cover"
            priority
          />
          <div className="w-3 h-3 rounded-full bg-[#52ed68] absolute top-0 -right-[6px] " />
        </div>

        <div className="flex flex-col ">
          <h2 className="text-xl font-bold tracking-wide">
            {receiver.fullName}
          </h2>
          <p className="text-[12px] tracking-wide">Active Now</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <FiSearch className="w-5 h-5 text-gray-500" />
        <FiMoreVertical className="w-5 h-5 text-gray-500" />
      </div>
    </header>
  );
};


// export const OpenChatHeaderSkeleton = () => {
//   return (
//     <div className="p-4 flex items-center gap-3 border-b">
//       <Skeleton className="w-[55px] h-[55px] rounded-full" />
//       <div className="flex flex-col gap-1">
//         <Skeleton className="w-[200px] h-6 rounded-md" />
//         <Skeleton className="w-20 h-3 rounded-md" />
//       </div>
//     </div>
//   );
// };
