import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import { Search } from "lucide-react";

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
    <div className="my-2 flex items-center gap-2 w-full">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-9 h-10"
            value={searchChatsQuery}
            onChange={handleSearchChats}
          />
        </div>
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
