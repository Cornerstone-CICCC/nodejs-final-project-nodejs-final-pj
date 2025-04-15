import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdyWwrKUFv8VlTg1HKiOBLVdrnMraEe3E",
  authDomain: "chat-app-4f33c.firebaseapp.com",
  projectId: "chat-app-4f33c",
  storageBucket: "chat-app-4f33c.firebasestorage.app",
  messagingSenderId: "141243351703",
  appId: "1:141243351703:web:46ece2a03c9351151b9fd2"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
