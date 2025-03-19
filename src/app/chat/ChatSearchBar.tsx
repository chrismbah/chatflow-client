import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";

interface SearchBarProps {
  searchChatsQuery: string;
  handleSearchChats: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleSidePanel: VoidFunction;
}

const ChatSearchBar = ({
  searchChatsQuery,
  handleSearchChats,
  toggleSidePanel,
}: SearchBarProps) => {
  return (
    <div className="my-3 flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7f7e81]" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10 rounded-full bg-[#2a2a2c] border-none focus:outline-none focus-visible:ring-0 focus-visible:border-none"
          value={searchChatsQuery}
          onChange={handleSearchChats}
        />
      </div>
      <button
        onClick={toggleSidePanel}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#4f46e5] shadow-md cursor-pointer"
      >
        <IoMdAdd className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
export default ChatSearchBar;
