"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      // TODO: emit user connected event to show user is online
      socket.emit("user-connected", "user-id");
    }
    socket.on("hello", (data) => {
      console.log(data);
    });
    return () => {
      if (isConnected) {
        // TODO: emit user connected event to show user is online
        socket.emit("user-disconnected", "user-id");
      }
    };
  }, [isConnected]);

  return (
    <main className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 min-h-[calc(100vh-57px)] bg-stone-100 font-sans">
      <div className="flex justify-center px-8 py-10 gap-3 md:flex-col md:col-span-1">
        <Button
          variant={"tertiary"}
          size={"lg"}
          className="text-lg h-12"
          asChild
        >
          <Link href="/login">Sign In</Link>
        </Button>
        <Button
          variant={"outline"}
          size={"lg"}
          className="text-lg h-12"
          asChild
        >
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
      <div className="w-full flex-grow bg-[url(/image-main.png)] bg-cover bg-center md:col-span-2 lg:col-span-3"></div>
    </main>
  );
}
