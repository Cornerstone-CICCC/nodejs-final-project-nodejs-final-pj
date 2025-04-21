"use client";

import { Chat, UserListItem } from "@/types/chat";
// import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  chatList: UserListItem[];
  chats: Chat;
  activeChatRecipientId: string | null;
  setActiveChatRecipientId: (id: string) => void;
  fetchMessages: () => Promise<void>;
  setChatList: (chats: Chat) => void;
  fetchChatListUsers: () => Promise<void>;
}

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatList: [],
      chats: {},
      activeChatRecipientId: null,
      setActiveChatRecipientId: (id) => set({ activeChatRecipientId: id }),
      setChatList: (chats) => set({ chats }),
      fetchChatListUsers: async () => {
        const res = await fetch("/api/messages/chatList");
        const { data } = await res.json();
        set({ chatList: data });
      },
      fetchMessages: async () => {
        const activeChatRecipientId = get().activeChatRecipientId;
        if (!activeChatRecipientId) return;
        const skip = get().chats[activeChatRecipientId]?.messages.length || 0;
        const limit = 10;
        const res = await fetch(
          `/api/messages/${
            get().activeChatRecipientId
          }?limit=${limit}&skip=${skip}`
        );
        const { data } = await res.json();

        if (!data.length) return;

        const messages = get().chats[activeChatRecipientId]?.messages || [];
        const updatedMessages = [...messages, ...data];
        const lastMessageTimestamp = data[data.length - 1].createdAt;

        set({
          chats: {
            ...get().chats,
            [activeChatRecipientId]: {
              messages: updatedMessages,
              lastMessageTimestamp: lastMessageTimestamp,
            },
          },
        });
      },
    }),
    {
      name: "chat-store",
    }
  )
);

export default useChatStore;
