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
}
