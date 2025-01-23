import AvatarSkeleton from "./ui/Skeleton/AvatarSkeleton"; // Assuming this is in the same directory

interface ChatSkeletonProps {
  count: number; // Number of skeletons to display
}

const ChatSkeleton = ({ count }: ChatSkeletonProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <li
      key={index}
      className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer animate-pulse"
    >
      <div className="flex items-center space-x-4">
        {/* Avatar Skeleton */}
        <AvatarSkeleton className="rounded-full" />

        <div className="flex-1 space-y-2">
          {/* Name Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-32"></div>

          {/* Message Skeleton */}
          <div className="h-3 bg-gray-300 rounded w-48"></div>
        </div>
      </div>

      <div className="text-right space-y-2">
        {/* Time Skeleton */}
        <div className="h-2 bg-gray-300 rounded w-12"></div>

        {/* Badge Skeleton */}
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
      </div>
    </li>
  ));

  return <ul>{skeletons}</ul>;
};

export default ChatSkeleton;
