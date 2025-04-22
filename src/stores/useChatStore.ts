"use client";

import { Chat, ChatMessage, UserListItem } from "@/types/chat";
import useUserStore from "@/stores/useUserStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  chatList: UserListItem[];
  chats: Chat;
  activeChatRecipientId: string | null;
  setActiveChatRecipientId: (id: string) => void;
  pushMessageToActiveChat: (message: ChatMessage) => void;
  decrementChatCount: () => void;
  markMessageRead: (messageId: string) => void;
  setLastMessagePreview: (
    message: ChatMessage,
    incrementChatCount: boolean
  ) => void;
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
      markMessageRead: (messageId) => {
        const activeChatRecipientId = get().activeChatRecipientId;
        if (!activeChatRecipientId) return;
        const updatedMessages = get().chats[
          activeChatRecipientId
        ]?.messages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              read: true,
            };
          }
          return message;
        });
        set((state) => ({
          chats: {
            ...state.chats,
            [activeChatRecipientId]: {
              ...state.chats[activeChatRecipientId],
              messages: updatedMessages,
            },
          },
        }));
      },
      decrementChatCount: () => {
        // const user = useUserStore.getState().user;
        const activeChatRecipientId = get().activeChatRecipientId;
        const updatedChatList = get().chatList.map((chatUser) => {
          if (chatUser._id === activeChatRecipientId) {
            return {
              ...chatUser,
              unreadCount: chatUser.unreadCount ? chatUser.unreadCount - 1 : 0,
            };
          }
          return chatUser;
        });
        set(() => ({
          chatList: [...updatedChatList],
        }));
      },
      setLastMessagePreview: (message, incrementChatCount = false) => {
        const user = useUserStore.getState().user;
        const updatedChatList = get().chatList.map((chatUser) => {
          if (
            chatUser._id === message.recipientId ||
            chatUser._id === message.senderId
          ) {
            let chatCount =
              chatUser.unreadCount && chatUser._id !== user?.id
                ? chatUser.unreadCount + 1
                : 1;
            if (message.senderId === user?.id) {
              chatCount = 0;
            }

            return {
              ...chatUser,
              unreadCount: incrementChatCount ? chatCount : 0,
              lastMessage: message.text,
              lastMessageTimestamp: message.updatedAt,
            };
          }
          return chatUser;
        });
        set(() => ({
          chatList: [...updatedChatList],
        }));
      },
      pushMessageToActiveChat: async (message) => {
        const user = useUserStore.getState().user;

        if (user?.id !== message.senderId && user?.id !== message.recipientId) {
          return;
        }
        const chatroomId =
          user?.id === message.senderId
            ? message.recipientId
            : message.senderId;
        console.log(chatroomId);
        console.log(message);
        const messages = get().chats[chatroomId]?.messages || [];
        const updatedMessages = [message, ...messages];
        const lastMessageTimestamp = message.createdAt;
        set((state) => ({
          chats: {
            ...state.chats,
            [chatroomId]: {
              messages: updatedMessages,
              lastMessageTimestamp: lastMessageTimestamp,
            },
          },
        }));
      },
      fetchChatListUsers: async () => {
        const res = await fetch("/api/messages/chatList");
        const { data } = await res.json();
        set({ chatList: data });
      },
      fetchMessages: async () => {
        const activeChatRecipientId = get().activeChatRecipientId;
        if (!activeChatRecipientId) return;
        const currentChat = get().chats[activeChatRecipientId];

        // set({
        //   chats: {},
        // });
        // If there are no messages in the current chat,
        if (currentChat && currentChat.messages.length) return;

        const skip =
          get().chats[activeChatRecipientId]?.messages.length - 1 || 0;
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
