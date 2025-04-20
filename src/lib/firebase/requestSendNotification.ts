export interface NotificationPayload {
  recipientId: string;
  title: string;
  body: string;
}

export const requestSendNotification = async (
  payload: NotificationPayload
): Promise<boolean> => {
  try {
    const response = await fetch("/api/notifications", {
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

    console.log("Notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};
