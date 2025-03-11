import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useProfile } from "./use-profile";

const SOCKET_SERVER_URL = "http://localhost:5000";

export const useSocket = () => {
  const { user } = useProfile();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    const newSocket = io(SOCKET_SERVER_URL);
    newSocket.emit("setup", user);
    newSocket.on("connected", () => setSocketConnected(true));
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return { socket, socketConnected };
};
