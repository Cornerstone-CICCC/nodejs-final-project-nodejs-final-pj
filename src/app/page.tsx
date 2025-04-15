import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col lg:grid lg:grid-cols-3 min-h-[calc(100vh-85px)] bg-stone-100">
      <div className="flex justify-center px-8 py-10 lg:flex-col lg:col-span-1 lg:gap-3">
        <Button variant={"tertiary"} size={"lg"} asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button variant={"outline"} size={"lg"} asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
      <div className="w-full flex-grow bg-[url(/image-main2.jpg)] bg-cover bg-center lg:col-span-2"></div>
    </main>
  );
}
