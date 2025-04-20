"use client";

import { useEffect } from "react";
import ChatRoomPlaceHolder from "@/components/chat/ChatRoom/ChatRoomPlaceHolder";
import UserList from "@/components/chat/UserList";
import useIsMobile from "@/hooks/useIsMobile";
import useChatStore from "@/stores/useChatStore";
import { UserListItemProps } from "@/components/chat/UserList/UserListItem";

const List = () => {
  const isMobile = useIsMobile();
  const chats = useChatStore((state) => state);

  useEffect(() => {
    if (chats.chatList.length === 0) {
      chats.fetchChatListUsers();
    }
    console.log({ list: chats.chatList });
  }, [chats]);

  return (
    <div className="md:grid md:grid-cols-3">
      <div className="md:col-span-1">
        <UserList
          users={chats.chatList.map((chat) => {
            return {
              userId: chat._id,
              displayName: chat.userName,
              unreadCount: chat.unreadCount ?? 0,
              timestamp: chat.lastMessageTimestamp,
              previewText: chat.lastMessageTimestamp,
              avatarUrl: chat.fileId,
              isActive: false,
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
