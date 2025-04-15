importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

let messaging;
if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification?.title || "Notification";
    const notificationOptions = {
      body: payload.notification?.body || "You have a new message",
      tag: notificationTitle,
      icon: payload.notification?.image || "/default-icon.png",
      data: {
        url: payload?.data?.openUrl || "/",
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
