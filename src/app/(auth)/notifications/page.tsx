import NotificationForm from "@/components/notification/NotificationForm";

const NotificationsPage = () => {
  return (
    <div className="flex flex-col gap-5 items-center min-h-screen bg-gray-100 p-20">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="w-full max-w-lg">
        <NotificationForm />
      </div>
    </div>
  );
};

export default NotificationsPage;
