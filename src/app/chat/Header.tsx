import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { LuBell } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  user: User | null;
}
export const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase(); // First letters of first and last name
  }
  return nameParts[0][0].toUpperCase(); // If only one name, return first letter
};

// Function to truncate username if it exceeds a certain length
export const truncateName = (name: string, maxLength = 15) => {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

export const Header = ({ user }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      {user ? (
        <div className="flex gap-4 items-center">
          <div className="relative w-10 h-10">
            <Avatar>
              <Image
                src={user.avatar}
                alt="User"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="w-3 h-3 rounded-full bg-[#52ed68] absolute top-0 -right-[10px] " />
          </div>

          <h2 className="text-2xl font-semibold">
            {truncateName(user.fullName)}
          </h2>
        </div>
      ) : (
        <HeaderSkeleton />
      )}
      <div className="flex items-center gap-4">
        <LuBell className="text-[#89888a] text-[22px] font-bold" />
        <BsThreeDots className="text-[#89888a] text-[22px] font-bold " />
      </div>
    </header>
  );
};

export const HeaderSkeleton = () => (
  <div className="flex items-center gap-3">
    <Skeleton className="h-[35px] w-[35px] rounded-full" />
    <Skeleton className="h-5 w-[250px]" />
  </div>
);
