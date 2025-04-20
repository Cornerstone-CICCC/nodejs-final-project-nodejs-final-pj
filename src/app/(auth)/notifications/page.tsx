import NotificationForm from "@/components/notification/NotificationForm";
import Sidebar from "@/components/sidebar/Sidebar";

const NotificationsPage = () => {
  return (
    <div className="flex flex-col gap-5 items-center min-h-screen bg-gray-100 p-20">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="w-full max-w-lg md:grid md:grid-cols-3">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-2">
          <NotificationForm />
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
