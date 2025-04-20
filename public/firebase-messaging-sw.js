importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCdyWwrKUFv8VlTg1HKiOBLVdrnMraEe3E",
  authDomain: "chat-app-4f33c.firebaseapp.com",
  projectId: "chat-app-4f33c",
  storageBucket: "chat-app-4f33c.firebasestorage.app",
  appId: "141243351703",
  messagingSenderId: "1:141243351703:web:46ece2a03c9351151b9fd2",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new message. Please check it out",
      icon: payload.notification?.icon || "/assets/icon.webp",
    data: { url: payload.fcmOptions?.link || "/" },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});
