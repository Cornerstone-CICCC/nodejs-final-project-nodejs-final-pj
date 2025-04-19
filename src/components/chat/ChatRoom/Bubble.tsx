import { cn } from "@/lib/utils";
import moment from "moment";

const Bubble = ({
  direction,
  message,
  timestamp,
}: {
  direction: string;
  message: string;
  timestamp: Date;
}) => {
  return (
    <div
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
