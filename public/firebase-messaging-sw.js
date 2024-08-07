// Import and configure the Firebase app
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Initialize Firebase with your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM-N18S7vjn4xmj9QAfQ2lMwcVf4Q_lqk",
  authDomain: "purecare-2a506.firebaseapp.com",
  projectId: "purecare-2a506",
  storageBucket: "purecare-2a506.appspot.com",
  messagingSenderId: "458703941149",
  appId: "1:458703941149:web:2320b58b1fe052c70ca0f4",
  measurementId: "G-PNR85X9X41"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
