import { MessageSquare } from "lucide-react";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";

const NoChat = () => {
  return (
    <div className="grid place-items-center md:h-[calc(100vh-57px)] border-l">
      <div className="text-center">
        <div
          className={cn(
            buttonVariants({ variant: "tertiary", size: "icon" }),
            "rounded-full size-[80px]"
          )}
        >
          <MessageSquare size={64} color="#fff" />
        </div>
        <h3 className="mt-3 mb-3 font-extrabold text-2xl">No Messages Yet.</h3>
        <p>Start a conversation by clicking user name in the left side.</p>
      </div>
    </div>
  );
};

export default NoChat;
