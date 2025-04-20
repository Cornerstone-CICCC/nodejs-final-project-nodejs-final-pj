interface NotificationPayload {
  type: string;
  recipientId: string;
  title: string;
  body: string;
}

export async function sendNotificationAPI(
  payload: NotificationPayload
): Promise<boolean> {
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

    return true;
  } catch (err) {
    console.error("Error sending notification:", err);
    return false;
  }
}
