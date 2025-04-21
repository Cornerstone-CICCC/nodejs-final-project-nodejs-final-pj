import NotificationForm from "@/components/notification/NotificationForm";
import Sidebar from "@/components/sidebar/Sidebar";

const NotificationsPage = () => {
  return (
    <div className="min-h-[calc(100vh-57px)] bg-gray-50 p-4 relative md:flex md:items-center">
      <div className="md:px-8 md:fixed md:left-0 md:top-0 md:pt-[165px]">
        <Sidebar />
      </div>
      <div className="w-full md:max-w-md md:m-auto md:mt-10">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationForm />
      </div>
    </div>
  );
};

export default NotificationsPage;
