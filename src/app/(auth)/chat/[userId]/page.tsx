"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ChatRoom from "@/components/chat/ChatRoom";
import UserList from "@/components/chat/UserList";
import useIsMobile from "@/hooks/useIsMobile";
import useChatStore from "@/stores/useChatStore";
import { UserListItemProps } from "@/components/chat/UserList/UserListItem";

const ChatDetail = () => {
  const params = useParams();
  const { userId: recipentId } = params;
  const isMobile = useIsMobile();
  const chats = useChatStore((state) => state);

  useEffect(() => {
    if (chats.chatList.length === 0) {
      chats.fetchChatListUsers();
    }
    if (recipentId) {
      chats.setActiveChatRecipientId(recipentId as string);
      chats.fetchMessages();
    }
  }, [recipentId, chats.chatList]);

  return (
    <div className="md:grid md:grid-cols-3">
      {!isMobile && (
        <div className="md:col-span-1">
          <UserList
            users={chats.chatList.map((chat) => {
              return {
                userId: chat._id,
                displayName: chat.userName,
                unreadCount: chat.unreadCount ?? 0,
                timestamp: chat.lastMessageTimestamp,
                previewText: chat.lastMessage,
                avatarUrl: chat.fileId,
                isActive: false,
              } as unknown as UserListItemProps;
            })}
          />
        </div>
      )}
      <div className="md:col-span-2 relative">
        <ChatRoom
          messages={
            recipentId && chats.chats[recipentId as string]
              ? chats.chats[recipentId as string].messages
              : []
          }
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ChatDetail;
