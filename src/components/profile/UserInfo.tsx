"use client";

import useUserStore from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UserInfo = () => {
  const router = useRouter();
  const { user } = useUserStore();
  console.log(user);
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleNavigate = () => {
    router.push("/profile/edit");
  };

  return (
    <div className="bg-white p-20 rounded-3xl max-w-md">
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src={user.fileId || "/default-profile.png"}
            alt="Profile Image" // Good but would be better if you can include the user's name as well like Nana's Profile Image
            layout="fill"
            objectFit="cover"
          />
        </div>
        <h1 className="text-4xl font-semibold">
          {user.name ? user.name : "New user"} {/** Can rewrite this as user.name ?? "New User" */}
        </h1>
        <p className=" mt-2 text-center">{user.bio}</p>
        <p className="text-gray-600">{user.email}</p>
        <Button onClick={handleNavigate}>Edit profile</Button>
      </div>
    </div>
  );
};

export default UserInfo;
