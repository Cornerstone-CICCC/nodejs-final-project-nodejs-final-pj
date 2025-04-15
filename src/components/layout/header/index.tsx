"use client";

import { UserRound, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  const getVariant = (pathname: string) => {
    if (path.startsWith(`/${pathname}`)) {
      return "tertiary";
    }
    return "secondary";
  };

  return (
    <header className="flex justify-between items-center px-4 py-6 border-b">
      <h1 className="font-extrabold">
        <Link href="/">DNTiC</Link>
      </h1>
      <nav>
        <ul className="flex gap-3">
          <li>
            <Button variant={getVariant("chat")} size={"icon"} asChild>
              <Link href="/chat/1">
                <MessageCircle />
                <span className="sr-only">Chat</span>
              </Link>
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={getVariant("profile")} size={"icon"}>
                  <UserRound />
                  <span className="sr-only">Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={16} align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile/1">
                    <UserRound />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
}
