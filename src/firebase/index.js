import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const config = {
  apiKey: "AIzaSyAC59QjdD_jBXyekdm-cMmvkmfTInLjnxw",
  authDomain: "norsu-bsc-bulletin.firebaseapp.com",
  projectId: "norsu-bsc-bulletin",
  storageBucket: "norsu-bsc-bulletin.appspot.com",
  messagingSenderId: "612359368831",
  appId: "1:612359368831:web:2f947ac01f623b47280f4a"
};

const app = initializeApp(config);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export { db, auth, storage, messaging };