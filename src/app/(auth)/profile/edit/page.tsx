import ProfileEditForm from "@/components/profile/ProfileEditForm";
import Sidebar from "@/components/sidebar/Sidebar";

const EditProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="block md:hidden mb-6">
        <Sidebar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hidden md:block md:col-span-1 md:sticky md:top-20 h-fit">
          <Sidebar />
        </div>
        <div className="md:col-span-3 md:ml-4">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
          <div className="w-full max-w-lg">
            <ProfileEditForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
