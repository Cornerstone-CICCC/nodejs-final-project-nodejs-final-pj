import ProfileEditForm from "@/components/profile/ProfileEditForm";
import Sidebar from "@/components/sidebar/Sidebar";

const EditProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative p-4">
      <div className="w-full max-w-[388px] md:col-span-1 md:px-8 md:fixed md:left-0 md:top-0 md:pt-[220px]">
        <Sidebar />
      </div>
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <div className="w-full max-w-lg">
          <ProfileEditForm />
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
