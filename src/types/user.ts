export interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
}

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: false;
  users: User[];
  latestMessage: {
    content: string;
  };
}

export interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  chat: string;
  read: boolean;
  createdAt: string; // ISO date string
}
