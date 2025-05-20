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
          variant={"link"} // Can just be "link"
          className={cn(
            "flex-shrink-0 flex-grow-0 w-auto justify-start px-0 border-black rounded-none hover:underline-offset-[12px]",
            checkPath("profile") && "border-b-2 hover:no-underline"
          )}
          asChild
        >
          <Link href="/profile/edit">Profile</Link>
        </Button>
      </div>
      <div className="inline-block">
        <Button
          variant={"link"} // Can just be "link"
          className={cn(
            "flex-shrink-0 flex-grow-0 w-auto justify-start px-0 border-black rounded-none mt-1.5 hover:underline-offset-[12px]",
            checkPath("notifications") && "border-b-2 hover:no-underline"
          )}
          // Missing asChild prop
        >
          <Link href="/notifications">Notifications</Link>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
