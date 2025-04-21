"use client";

import { Chat, UserListItem } from "@/types/chat";
// import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  chatList: UserListItem[];
  // setUser: (users: User[]) => void;
  chats: Chat;
  setChatList: (chats: Chat) => void;
  fetchChatListUsers: () => Promise<void>;
}

const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chatList: [],
      chats: {},
      // setUser: (chatList) => set({ chatList }),
      setChatList: (chats) => set({ chats }),
      fetchChatListUsers: async () => {
        const res = await fetch("/api/messages/chatList");
        const { data } = await res.json();
        set({ chatList: data });
        console.log("Fetched chat list users:", data);
      },
      fetchMessages: async (userId: string) => {
        const res = await fetch(`/api/messages/${userId}`);
        const { data } = await res.json();
        set({ chats: data });
      },
    }),
    {
      name: "chat-store",
    }
  )
);

export default useChatStore;
