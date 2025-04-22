"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
