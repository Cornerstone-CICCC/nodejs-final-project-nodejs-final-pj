import { getToken, messaging } from "./firebase";
import { saveFcmToken } from "./saveFcmToken";

export const requestNotificationPermission = async (userId: string) => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    if (!registration) {
      console.warn("Service Worker registration failed.");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("Failed to retrieve FCM token.");
      return;
    }

    // Save the token to the db
    const result = await saveFcmToken(token, userId);
    if (!result) {
      console.warn("Failed to save FCM token.");
      return;
    }
  } catch (error) {
    console.error("Error requesting permission:", error);
    return;
  }
};
