"use client";

import { useEffect, useState } from "react";
import ChatRoomPlaceHolder from "@/components/chat/ChatRoom/ChatRoomPlaceHolder";
import UserList from "@/components/chat/UserList";
import useIsMobile from "@/hooks/useIsMobile";
import useChatStore from "@/stores/useChatStore";
import { UserListItemProps } from "@/components/chat/UserList/UserListItem";
import socket from "@/lib/socket";
import useUserStore from "@/stores/useUserStore";

const List = () => {
  const isMobile = useIsMobile();
  const chats = useChatStore((state) => state);
  const userId = useUserStore((state) => state.user?.id);
  const markRecipientOnline = useChatStore(
    (state) => state.markRecipientOnline
  );
  const markRecipientOffline = useChatStore(
    (state) => state.markRecipientOffline
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (chats.chatList.length === 0) {
      chats.fetchChatListUsers();
    }
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("user-login", (userId: string) => {
      chats.markRecipientOnline(userId);
    });
    socket.on("user-logout", (userId: string) => {
      chats.markRecipientOffline(userId);
    });

    return () => {
      socket.off("user-login");
      socket.off("user-logout");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      // TODO: emit user connected event to show user is online
      if (!userId) return;
      markRecipientOnline(userId);
      socket.emit("user-connected", userId);
    }

    return () => {
      if (isConnected) {
        // TODO: emit user connected event to show user is offline
        if (!userId) return;
        markRecipientOffline(userId);
        socket.emit("user-disconnected", userId);
      }
    };
  }, [isConnected]);

  return (
    <div className="md:grid md:grid-cols-3">
      <div className="md:col-span-1">
        <UserList
          users={chats.chatList.map((chat) => {
            return {
              userId: chat._id,
              displayName: chat.name ? chat.name : chat.userName,
              unreadCount: chat.unreadCount ?? 0,
              timestamp: chat.lastMessageTimestamp,
              previewText: chat.lastMessage,
              avatarUrl: chat.fileId,
              isActive: chat.isLoggedIn,
            } as unknown as UserListItemProps;
          })}
        />
      </div>
      {!isMobile && (
        <div className="md:col-span-2 relative">
          <ChatRoomPlaceHolder roomMessage="Select chatting room." />
        </div>
      )}
    </div>
  );
};

export default List;
