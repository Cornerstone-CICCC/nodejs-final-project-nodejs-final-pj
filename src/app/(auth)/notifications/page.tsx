import NotificationForm from "@/components/notification/NotificationForm";
import Sidebar from "@/components/sidebar/Sidebar";

const NotificationsPage = () => {
  return (
    <div className="flex flex-col gap-5 items-center min-h-screen bg-gray-100 p-20  relative">
      <div className="w-full max-w-[358px] md:col-span-1 md:px-8 md:fixed md:left-0 md:top-0 md:pt-[165px]">
        <Sidebar />
      </div>
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="w-full max-w-lg">
          <div className="md:col-span-2">
            <NotificationForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
