"use client";

import ChatRoom from "@/components/chat/ChatRoom";
import UserList from "@/components/chat/UserList";
import { useEffect, useState } from "react";

const ChatDetail = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
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
