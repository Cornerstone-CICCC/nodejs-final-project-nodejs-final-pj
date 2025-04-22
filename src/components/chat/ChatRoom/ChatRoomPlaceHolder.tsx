import { MessageSquare } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";

const ChatRoomPlaceHolder = ({ roomMessage }: { roomMessage: string }) => {
  return (
    <div className="grid place-items-center h-[calc(100vh-57px)] border-l">
      <div className="text-center">
        <div
          className={cn(
            buttonVariants({ variant: "tertiary", size: "icon" }),
            "rounded-full size-[80px] [&_svg:not([class*='size-'])]:size-8"
          )}
        >
          <MessageSquare size={64} />
        </div>
        <h3 className="mt-3 mb-3 font-extrabold text-2xl">{roomMessage}</h3>
        <p className="mb-5">Start a conversation by sending a message.</p>
        {/* <Button variant={"tertiary"} asChild>
          <Link href="/chat/list">Choose user 😉</Link>
        </Button> */}
      </div>
    </div>
  );
};

export default ChatRoomPlaceHolder;
