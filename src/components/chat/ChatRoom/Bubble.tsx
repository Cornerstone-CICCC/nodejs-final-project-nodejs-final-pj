import React, { useEffect } from "react";
import moment from "moment";
import { cn } from "@/lib/utils";
import useInScrollViewport from "@/hooks/useIsVisible";
import useUserStore from "@/stores/useUserStore";
import useChatStore from "@/stores/useChatStore";

const Bubble = ({
  direction,
  message,
  read,
  messageId,
  timestamp,
  receipentId,
}: {
  messageId: string;
  direction: string;
  message: string;
  timestamp: Date;
  read: boolean;
  receipentId: string;
}) => {
  const ref = React.createRef<HTMLDivElement>();
  const loggedInUserId = useUserStore((state) => state.user?.id);
  const markMessageRead = useChatStore((state) => state.markMessageRead);
  const decrementChatCount = useChatStore((state) => state.decrementChatCount);
  const isVisible = useInScrollViewport(ref);

  useEffect(() => {
    if (isVisible) {
      console.log("Message seen:");
      if (!read && receipentId === loggedInUserId) {
        console.log({ read });
        fetch(`/api/messages/read`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: messageId }),
        })
          .then((res) => res.json())
          .then(() => {
            // update message count in chat store
            markMessageRead(messageId);
            decrementChatCount();
          })
          .catch((err) => {
            console.error("Error marking message as read", err);
          });
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col my-2",
        direction === "left" ? "justify-start" : "items-end"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-3 max-w-2xs",
          direction === "left"
            ? "justify-start rounded-bl-none bg-white/80"
            : "justify-end rounded-br-none bg-goldenrod-yellow/85"
        )}
      >
        <p>{message}</p>
      </div>
      <span className="text-xs text-gray-500 my-2">
        {moment(timestamp).format("h:m A")}
      </span>
    </div>
  );
};

export default Bubble;
