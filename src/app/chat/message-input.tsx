"use client";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { IoPaperPlane } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

interface MessageInputProps {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  sendMessage: () => void;
}

const MessageInput = ({
  message,
  setMessage,
  sendMessage,
}: MessageInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage();
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prevMessage: string) => prevMessage + emojiObject.emoji);
    // Don't close the picker here to allow multiple emoji selections
  };

  return (
    <div className="flex items-center p-4 relative">
      <div className="relative flex-1">
        <button
          type="button"
          aria-label="Open emoji picker"
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <BsEmojiSmile className="w-5 h-5" />
        </button>
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full left-0 mb-2 z-10"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Write a message..."
          className="hide-scrollbar w-full placeholder:text-[#4e4f55] px-16 py-5 bg-[#26262e] h-[70px] flex items-center justify-center border rounded-lg focus:outline-none focus:ring-0 resize-none"
          rows={1}
          aria-label="Message input"
        ></textarea>
        <button
          type="button"
          aria-label="Attach file"
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        >
          <AiOutlinePaperClip className="w-6 h-6" />
        </button>
      </div>
      <button
        onClick={handleSendMessage}
        className="p-4 ml-4 bg-gradient-to-br from-[#6365f132] to-[#4e46e52c] bg-opacity-10 rounded-full"
        aria-label="Send message"
        disabled={!message.trim()}
      >
        <div className="p-2 flex items-center justify-center text-white bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-full">
          <IoPaperPlane className="w-5 h-5" />
        </div>
      </button>
    </div>
  );
};

export default MessageInput;
