import AvatarSkeleton from "./AvatarSkeleton"; // Assuming this is in the same directory
import { IoMdPersonAdd } from "react-icons/io"; // Assuming you want the same icon for the button

interface UsersSkeletonProps {
  count: number; // Number of skeletons to display
}

const UsersSkeleton = ({ count }: UsersSkeletonProps) => {
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
          <IoMdPersonAdd className="w-6 h-6 text-gray-300" />
        </div>
      </div>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};

export default UsersSkeleton;
