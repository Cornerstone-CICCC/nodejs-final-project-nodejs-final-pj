import { getToken, messaging } from "./firebase";

export const requestNotificationPermission = async () => {
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
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("Failed to retrieve FCM token.");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error requesting permission:", error);
    return null;
  }
};
