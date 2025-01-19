"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axios";

const Chat = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chats, setChats] = useState<any[]>([]);
  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await axiosInstance.get("/api/chat/");
      setChats(data);
    };
    fetchChats();
  }, []);

  return (
    <>
      {chats.map((chat, i) => (
        <div key={i}>
          <h1>{chat?.chatName}</h1>
        </div>
      ))}
    </>
  );
};

export default Chat;
