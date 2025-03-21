import { useEffect, useState } from "react";
import { useSocket } from "./use-socket";

const useUserStatus = (userId: string) => {
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!socket || !userId) return;

    // Request the initial status when the hook mounts
    socket.emit("get_user_status", userId);

    // Listen for the status response
    socket.on("user_status_response", ({ userId: responseUserId, isOnline: userIsOnline }) => {
      if (responseUserId === userId) {
        setIsOnline(userIsOnline);
      }
    });

    // Your existing event listeners
    socket.on("user_online", ({ userId: onlineUserId }) => {
      if (onlineUserId === userId) {
        setIsOnline(true);
      }
    });

    socket.on("user_offline", ({ userId: offlineUserId }) => {
      if (offlineUserId === userId) {
        setIsOnline(false);
      }
    });

    return () => {
      socket?.off("user_status_response");
      socket?.off("user_online");
      socket?.off("user_offline");
    };
  }, [socket, userId]);

  return isOnline;
};

export default useUserStatus;