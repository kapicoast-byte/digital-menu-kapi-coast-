// Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app tab is closed/backgrounded.
//
// SETUP: To enable background push, go to Firebase Console →
// Project Settings → Cloud Messaging → Web Push certificates
// and generate a VAPID key pair. Paste the public key into index.html
// where indicated (VAPID_KEY_HERE).

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB_gtI05K2B7GUEslsMjU_pN4B7rV8kkbM",
  authDomain: "pspk-c5298.firebaseapp.com",
  projectId: "pspk-c5298",
  storageBucket: "pspk-c5298.firebasestorage.app",
  messagingSenderId: "426256600838",
  appId: "1:426256600838:web:e8f5b8f4be326d482c5887",
  measurementId: "G-YSBZE6JDTY"
});

const messaging = firebase.messaging();

// Handle background messages (tab closed or backgrounded)
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Kapi Coast";
  const body  = payload.notification?.body  || "Check out our latest offer!";
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'kapi-coast-offer',
    renotify: true,
    data: { url: payload.data?.url || '/' }
  });
});

// Open/focus app when notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
