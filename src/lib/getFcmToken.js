"use client";

import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export const getFcmToken = async () => {
  try {
    const messaging = await getFirebaseMessaging();
    console.log("messaging:", messaging);

    if (!messaging) return null;

    const permission = await Notification.requestPermission();
    console.log("permission:", permission);

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BLPy29GpzkCw6kJVd-mlZRbXW8R0wRNxu_PrLG9qMPuucQcUtTVxoOFVhtnAlzBRQJYwsxXGAHMoSSHoc8nLXCw"
      });

      return token;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};