"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const path = usePathname();

  const checkPath = (pathname: string) => {
    if (path.startsWith(`/${pathname}`)) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col mb-8">
      <div className="inline-block">
        <Button
          variant={"link"}
          className="flex-shrink-0 flex-grow-0 w-auto justify-start px-0"
          asChild
        >
          <Link
            href="/profile/1"
            className={cn(
              "justify-start border-black rounded-none",
              checkPath("profile") && "border-b-2"
            )}
          >
            Profile
          </Link>
        </Button>
      </div>
      <div className="inline-block">
        <Button
          variant={"link"}
          className="flex-shrink-0 flex-grow-0 w-auto justify-start px-0 mt-1.5"
          asChild
        >
          <Link
            href="/notifications"
            className={cn(
              "justify-start border-black rounded-none",
              checkPath("notifications") && "border-b-2"
            )}
          >
            Notifications
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
