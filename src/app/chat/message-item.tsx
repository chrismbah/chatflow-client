"use client";
import { Message, User } from "@/types";
import Image from "next/image";
import moment from "moment";
import { IoCheckmark, IoCheckmarkDone, IoTimeOutline } from "react-icons/io5";

interface MessageItemProps {
  message: Message;
  currentUser: User | null;
  receiver: User | null;
}

const MessageItem = ({ message, currentUser, receiver }: MessageItemProps) => {
  const isSender = message.sender._id === currentUser?._id;

  // Handle message status display
  const getMessageStatusIcon = () => {
    if (!receiver || message.sender._id !== currentUser?._id) return null;

    if (message.status === "pending") {
      return <IoTimeOutline className="w-3 h-3 text-white" />;
    } else if (message.readBy.includes(receiver._id)) {
      return <IoCheckmarkDone className="w-3 h-3 text-white" />;
    } else {
      return <IoCheckmark className="w-3 h-3 text-white" />;
    }
  };

  return (
    <div
      className={`flex message-item ${
        isSender ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`flex items-end ${
          isSender ? "flex-row-reverse" : "flex-row"
        } gap-2`}
      >
        <Image
          src={message.sender.avatar}
          alt={message.sender.fullName}
          width={35}
          height={35}
          className="rounded-full"
        />

        <div
          className={`flex flex-col gap-1 ${
            isSender ? "items-end" : "items-start"
          } `}
        >
          <div
            className={`relative max-w-xs p-2 break-words rounded-t-lg ${
              isSender
                ? "bg-[#2c2b31] rounded-bl-lg"
                : "bg-gradient-to-r from-[#4338ca] to-[#6366f1] via-[#4f46e5] rounded-br-lg"
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="flex items-center">
            <div
              className={`text-[11px] ${
                isSender ? "text-white mr-1" : "text-gray-100"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </div>
            {getMessageStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
