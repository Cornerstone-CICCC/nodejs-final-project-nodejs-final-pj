"use client";

import ChatRoomPlaceHolder from "@/components/chat/ChatRoom/ChatRoomPlaceHolder";
import UserList from "@/components/chat/UserList";
import useIsMobile from "@/hooks/useIsMobile";

const List = () => {
  const isMobile = useIsMobile();
  console.log(isMobile);
  return (
    <div className="md:grid md:grid-cols-3">
      <div className="md:col-span-1">
        <UserList />
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
