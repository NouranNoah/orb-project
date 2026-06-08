importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAduR3n-Hhueu10matOF-2Ga4sIuEcptBY",
    authDomain: "carenest-438417.firebaseapp.com",
    projectId: "carenest-438417",
    storageBucket: "carenest-438417.firebasestorage.app",
    messagingSenderId: "675853062971",
    appId: "1:675853062971:web:599efb25eac0ca4a249d1e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
    }
  );
});