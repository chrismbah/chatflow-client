import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useProfile } from "./use-profile";

const SOCKET_SERVER_URL = "http://localhost:5000"; 

export const useSocket = () => {
  const { user } = useProfile();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(SOCKET_SERVER_URL, {
      query: { userId: user._id }, // Pass user ID for authentication
      transports: ["websocket"], // Ensures WebSocket connection
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return socket;
};
