import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyAduR3n-Hhueu10matOF-2Ga4sIuEcptBY",
    authDomain: "carenest-438417.firebaseapp.com",
    projectId: "carenest-438417",
    storageBucket: "carenest-438417.firebasestorage.app",
    messagingSenderId: "675853062971",
    appId: "1:675853062971:web:599efb25eac0ca4a249d1e",
    // measurementId: "G-DT7T2V1JG4"
};


const app = initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();

  if (supported && typeof window !== "undefined") {
    return getMessaging(app);
  }

  return null;
};