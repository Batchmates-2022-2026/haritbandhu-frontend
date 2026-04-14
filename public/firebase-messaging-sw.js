importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAH9IpwWIHvMiQnxp2UDzxgHzp5YYQj9SI",
  authDomain: "haritmitra-b54e8.firebaseapp.com",
  projectId: "haritmitra-b54e8",
  storageBucket: "haritmitra-b54e8.firebasestorage.app",
  messagingSenderId: "1094704745192",
  appId: "1:1094704745192:web:7eace61b91276bcd8a175d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Background message received:", payload);
  const notificationTitle = payload.notification?.title || "HaritBandhu";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
