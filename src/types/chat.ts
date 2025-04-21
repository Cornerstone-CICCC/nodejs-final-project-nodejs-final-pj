export interface Chat {
  [key: string]: {
    messages: ChatMessage[];
    lastMessageTimestamp?: Date;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  read: boolean;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListItem {
  _id: string;
  name: string;
  userName: string;
  email: string;
  bio: string;
  fileId: string;
  unreadCount: number;
  lastMessageTimestamp: Date;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}
