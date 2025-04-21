"use client";

 
import useUserStore from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const router = useRouter();
  const { user } = useUserStore();
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleNavigate = () => {
    router.push("/profile/edit");
  };

  return (
    <div className="bg-white p-20 rounded-3xl max-w-md">
      <div className="flex flex-col items-center gap-2">
        {/* <img
          src={user.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        /> */}
        <h1 className="text-4xl font-semibold">{user.name ? user.name : "New user"}</h1>
        <p className=" mt-2 text-center">{user.bio}</p>
        <p className="text-gray-600">{user.email}</p>
        <Button onClick={handleNavigate}>Edit profile</Button>
      </div>
    </div>
  );
};

export default UserInfo;
