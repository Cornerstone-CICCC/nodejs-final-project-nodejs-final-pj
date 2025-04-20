import UserInfo from "@/components/profile/UserInfo";
import Sidebar from "@/components/sidebar/Sidebar";

const UserProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 md:grid md:grid-cols-3">
      <div className="md:col-span-1 md:px-8">
        <Sidebar />
      </div>
      <div className="md:col-span-2">
        <UserInfo />
      </div>
    </div>
  );
};

export default UserProfilePage;
