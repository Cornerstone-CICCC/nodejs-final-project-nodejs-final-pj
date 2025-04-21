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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from 'next/navigation';
import useUserStore from '@/stores/useUserStore';

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const { user, setUser } = useUserStore();

  const getVariant = (pathname: string) => {
    if (path.startsWith(`/${pathname}`)) {
      return "tertiary";
    }
    return "outline";
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      const data = await res.json();
      console.log('Logout response:', data);

      // Clear the user from zustand store
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b h-14">
      <h1 className="font-extrabold text-xl">
        <Link href="/">DNTiC</Link>
      </h1>
      <nav>
        <ul className="flex gap-3">
          {user && (
            <>
              <li className="flex items-center">
                <Button
                  variant={getVariant("chat")}
                  size={"icon"}
                  className="size-10 rounded-full"
                  asChild
                >
                  <Link href="/chat/1">
                    <MessageCircle />
                    <span className="sr-only">Chat</span>
                  </Link>
                </Button>
              </li>
              <li className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={getVariant("profile")}
                      size={"icon"}
                      className="size-10 rounded-full px-0 py-0"
                    >
                      <Avatar className="flex items-center justify-center">
                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                        <AvatarImage src="/default-profile.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Profile</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent sideOffset={6} align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.id}`}>
                        <UserRound />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
