/* eslint-disable @next/next/no-img-element */
import { FiSettings } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineGroupAdd } from "react-icons/md";
import { AvatarSkeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

const Navbar = ({
  isUserLoading,
  user,
}: {
  isUserLoading: boolean;
  user: User | null;
}) => {
  return (
    <aside className="hidden sm:flex flex-col items-center w-14 bg-white border-r py-4 space-y-6">
      {isUserLoading ? (
        <AvatarSkeleton />
      ) : (
        user && (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        )
      )}
      <button title="Chats" className="relative p-2 rounded hover:bg-gray-100">
        <AiOutlineMessage className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
          3
        </span>
      </button>
      <button
        title="Create Group"
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <MdOutlineGroupAdd className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
      </button>
      <button title="Settings" className="p-2 rounded hover:bg-gray-100">
        <FiSettings className="w-6 h-6 text-gray-600 hover:text-indigo-500" />
      </button>
    </aside>
  );
};

export default Navbar;
