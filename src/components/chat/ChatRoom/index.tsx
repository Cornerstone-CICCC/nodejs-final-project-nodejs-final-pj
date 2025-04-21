"use client";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Bubble from "./Bubble";
import MessageForm from "./MessageForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatRoomPlaceHolder from "./ChatRoomPlaceHolder";
import useChatStore from "@/stores/useChatStore";
import { ChatMessage } from "@/types/chat";

const loggedInUserId = "testId";

interface ChatRoomProps {
  isMobile: boolean;
  messages: ChatMessage[];
}

const ChatRoom = ({ isMobile, messages }: ChatRoomProps) => {
  const fetchMessages = useChatStore((state) => state.fetchMessages);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  return (
    <>
      {!messages.length ? (
        <ChatRoomPlaceHolder roomMessage="No Messages Yet." />
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
                Sarah Packer
              </span>
              <span className="truncate text-xs">Online</span>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4 bg-gray-100">
            {messages.map((msg) => (
              <Bubble
                key={msg._id} // need to unique
                direction={msg.senderId === loggedInUserId ? "right" : "left"}
                message={msg.text}
                timestamp={msg.createdAt}
              />
            ))}
          </ScrollArea>
          <MessageForm />
        </div>
      )}
    </>
  );
};

export default ChatRoom;
