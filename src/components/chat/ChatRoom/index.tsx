"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Bubble from "./Bubble";
import MessageForm from "./MessageForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatRoomPlaceHolder from "./ChatRoomPlaceHolder";

interface Message {
  userId: string;
  message: string;
  timestamp: Date;
}

const loggedInUserId = "testId";

const BubbleMessage: Message[] = [
  {
    userId: "testId",
    message: "Hellllllo",
    timestamp: new Date(),
  },
  {
    userId: "testId2",
    message: "How is it going?",
    timestamp: new Date(),
  },
  {
    userId: "testId",
    message: "Bye",
    timestamp: new Date(),
  },
];

const ChatRoom = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <>
      {BubbleMessage.length === 0 ? (
        <ChatRoomPlaceHolder roomMessage="No Messages Yet." />
      ) : (
        <div className="border-l">
          <div className="flex items-center border-b p-4">
            {isMobile && (
              <Link href="/chat/list">
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
            {BubbleMessage.map((msg) => (
              <Bubble
                key={msg.userId} // need to unique
                direction={msg.userId === loggedInUserId ? "right" : "left"}
                message={msg.message}
                timestamp={msg.timestamp}
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
