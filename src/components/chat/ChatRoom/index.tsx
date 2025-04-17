import { ScrollArea } from "@/components/ui/scroll-area";
import Bubble from "./Bubble";
import MessageForm from "./MessageForm";

interface Message {
  userId: string;
  message: string;
  time: Date;
}

const loggedInUserId = "testId";

const BubbleMessage: Message[] = [
  {
    userId: "testId",
    message: "Hellllllo",
    time: new Date(),
  },
  {
    userId: "testId2",
    message: "How is it going?",
    time: new Date(),
  },
  {
    userId: "testId",
    message: "Bye",
    time: new Date(),
  },
];

const ChatRoom = () => {
  return (
    <div className="border-l">
      <ScrollArea className="h-[calc(100vh-57px)] w-full p-4">
        {BubbleMessage.map((msg) => (
          <Bubble
            key={msg.userId} // need to unique
            direction={msg.userId === loggedInUserId ? "right" : "left"}
            message={msg.message}
            time={msg.time.toString()}
          />
        ))}
      </ScrollArea>
      <MessageForm />
    </div>
    // if there is no chat, show NoChat component
  );
};

export default ChatRoom;
