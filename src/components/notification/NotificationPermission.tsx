"use client";

import { useEffect } from "react";
import { requestNotificationPermission } from "@/lib/firebase/requestNotificationPermission";
import useUserStore from "@/stores/useUserStore";

const NotificationPermission = () => {
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) {
      const subscribeUser = async () => {
        await requestNotificationPermission(user.id);
      };

      subscribeUser();
    }
  }, [user]);

  return null;
};

export default NotificationPermission;
