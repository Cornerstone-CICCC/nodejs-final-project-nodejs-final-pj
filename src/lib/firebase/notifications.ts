import {
  NotificationPayload,
  NotificationSettingsResponse,
} from "../../types/notificationSettings";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const getNotificationSettings = async (
  userId: string
): Promise<{ enabled: boolean; [key: string]: boolean }> => {
  try {
    const url = `${BASE_URL}/api/notification-settings/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings.");
    }

    const responseData: NotificationSettingsResponse = await response.json();
    const { notificationsEnabled, notificationTypes } = responseData.settings;

    return {
      enabled: notificationsEnabled,
      ...notificationTypes,
    };
  } catch (err) {
    console.error(err);
    return { enabled: false };
  }
};

export const sendNotificationAPI = async (
  payload: NotificationPayload
): Promise<boolean> => {
  try {
    const settings = await getNotificationSettings(payload.recipientId);

    if (!settings) {
      console.error("Failed to fetch notification settings.");
      return false;
    }

    if (!settings.enabled) {
      console.log("Notifications are disabled for this user.");
      return false;
    }

    if (!settings[payload.notificationType]) {
      console.log(
        `Notification type '${payload.notificationType}' is disabled.`
      );
      return false;
    }

    const url = `${BASE_URL}/api/notifications`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to send notification:", await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error sending notification:", err);
    return false;
  }
};
