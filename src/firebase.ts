import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAH9IpwWIHvMiQnxp2UDzxgHzp5YYQj9SI",
  authDomain: "haritmitra-b54e8.firebaseapp.com",
  projectId: "haritmitra-b54e8",
  storageBucket: "haritmitra-b54e8.firebasestorage.app",
  messagingSenderId: "1094704745192",
  appId: "1:1094704745192:web:7eace61b91276bcd8a175d"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
export default app;
