import ProfileEditForm from "@/components/profile/ProfileEditForm";

const EditProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <div className="w-full max-w-lg">
        <ProfileEditForm />
      </div>
    </div>
  );
};

export default EditProfilePage;
