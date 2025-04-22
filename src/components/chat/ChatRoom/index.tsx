"use client";
"use strict";
import { useEffect } from "react";
import Bubble from "./Bubble";
import MessageForm from "./MessageForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatRoomPlaceHolder from "./ChatRoomPlaceHolder";
import useChatStore from "@/stores/useChatStore";
import { ChatMessage, UserListItem } from "@/types/chat";
import useUserStore from "@/stores/useUserStore";
import socket from "@/lib/socket";
import React from "react";

interface ChatRoomProps {
  isMobile: boolean;
  messages: ChatMessage[];
  user?: UserListItem;
}

const ChatRoom = ({ isMobile, messages, user }: ChatRoomProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const loggedInUserId = useUserStore((state) => state.user?.id);
  const activeChatRecipientId = useChatStore(
    (state) => state.activeChatRecipientId
  );
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const pushMessageToActiveChat = useChatStore(
    (state) => state.pushMessageToActiveChat
  );
  const setLastMessagePreview = useChatStore(
    (state) => state.setLastMessagePreview
  );

  useEffect(() => {
    const fn = async () => {
      await fetchMessages();
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("recieved_message", (data: { message: ChatMessage }) => {
      pushMessageToActiveChat(data.message);
      let increamentCount = false;
      if (
        activeChatRecipientId &&
        data.message.recipientId !== activeChatRecipientId &&
        data.message.senderId !== user?._id
      ) {
        increamentCount = true;
      }
      setLastMessagePreview(data.message, increamentCount);

      if (increamentCount) return;

      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      socket.off("recieved_message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!messages.length ? (
        <>
          <ChatRoomPlaceHolder roomMessage="No Messages Yet." />
          <MessageForm />
        </>
      ) : (
        <div className="border-l">
          <div className="flex items-center border-b p-4">
            {isMobile && (
              <Link href="/chat/list" className="mr-3">
                <ArrowLeft />
              </Link>
            )}
            <Avatar className="flex items-center justify-center w-10 h-10">
              <AvatarImage src="/default-profile.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight ml-4">
              <span className="truncate font-medium mb-1 overflow-hidden text-ellipsis">
                {user?.userName ? user.userName : user?.name}
              </span>
              <span className="truncate text-xs">Online</span>
            </div>
          </div>
          <div
            ref={scrollAreaRef}
            className="h-[calc(100vh-130px)] flex flex-col-reverse overflow-y-scroll pb-20 w-full p-4 bg-gray-100"
          >
            {messages.map((msg) => (
              <Bubble
                key={msg.id + crypto.randomUUID()}
                messageId={msg.id}
                direction={msg.senderId === loggedInUserId ? "right" : "left"}
                read={msg.read}
                message={msg.text}
                timestamp={msg.updatedAt}
                receipentId={msg.recipientId}
              />
            ))}
          </div>
          <MessageForm />
        </div>
      )}
    </>
  );
};

export default ChatRoom;
