"use client";

import ChatRoom from "@/components/chat/ChatRoom";
import UserList from "@/components/chat/UserList";
import useIsMobile from "@/hooks/useIsMobile";

const ChatDetail = () => {
  const isMobile = useIsMobile();

  return (
    <div className="md:grid md:grid-cols-3">
      {!isMobile && (
        <div className="md:col-span-1">
          <UserList />
        </div>
      )}
      <div className="md:col-span-2 relative">
        <ChatRoom isMobile={isMobile} />
      </div>
    </div>
  );
};

export default ChatDetail;
