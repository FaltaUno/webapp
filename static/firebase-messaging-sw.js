/* global importScripts, firebase, clients */
importScripts("https://www.gstatic.com/firebasejs/4.11.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/4.11.0/firebase-messaging.js"
);

firebase.initializeApp({
  messagingSenderId: "1019925486930"
});
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
  const notificationData = JSON.parse(payload.data.notification) || {};
  const notificationTitle = notificationData.title || "Falta Uno!";
  const notificationOptions = {
    body: notificationData.body || "Llegó una notificación",
    icon: notificationData.icon || "static/favicon-96x96.png",
    tag: notificationData.tag || "notification",
    image: notificationData.image || "",
    renotify: notificationData.renotify || false,
    data: {
      url: notificationData.url || "https://falta-uno-webapp.now.sh/"
    }
  };
  if (notificationData.tag === "notification") {
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  }
  return false;
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then(clientList => {
        for (let i = 0; i < clientList.length; i += 1) {
          const client = clientList[i];
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
        return false;
      })
  );
});
