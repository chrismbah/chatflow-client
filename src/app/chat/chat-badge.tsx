"use client";
import { User } from "@/types";

const ChatBadge = ({ receiver }: { receiver: User }) => {
  return (
    <div className="bg-[#26262ec5] backdrop-blur-lg shadow-xl text-sm font-medium text-center p-6 mx-auto max-w-[640px] rounded-lg text-gray-300">
      You are now chatting with {receiver.fullName} <br /> Please keep to
      community standards and have a great conversation!
    </div>
  );
};

export default ChatBadge;