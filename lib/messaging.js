import { loadFB } from "./firebase";
import "firebase/messaging";

let firebaseMessaging = false;

export const loadMessaging = () => {
  //return firebase.database().ref('v0')
  if (!firebaseMessaging) {
    firebaseMessaging = loadFB().messaging();
    firebaseMessaging.usePublicVapidKey(
      process.env.FIREBASE_MESSAGING_VAPID_KEY
    );
  }
  return firebaseMessaging;
};

export const checkMessagingStatus = () => {
  const messaging = loadMessaging();
  return messaging
    .getToken()
    .then(token => {
      // Permission has not been asked for
      if (!token) {
        return { permission: null, token: null };
      }

      // Token retrieved succcessfully
      return { permission: true, token };
    })
    .catch(err => {
      // Token cannot be retrieved because the permission is blocked
      return { permission: false, token: null };
    });
};

export const getMessagingToken = () => {
  const messaging = loadMessaging();
  return messaging
    .requestPermission()
    .then(() => {
      return messaging
        .getToken()
        .then(token => ({ permission: true, token }))
        .catch(err => {
          console.error("An error occurred while retrieving token. ", err);
          return { permission: null, token: null };
        });
    })
    .catch(err => {
      console.error("Unable to get permission to notify.", err);
      return { permission: false, token: null };
    });
};

export const onMessagingTokenRefresh = callback => {
  const messaging = loadMessaging();
  return messaging.onTokenRefresh(() => {
    messaging
      .getToken()
      .then(function(token) {
        callback({ permission: true, token });
      })
      .catch(function(err) {
        console.error("Unable to get refreshed token.", err);
        callback({ permission: null, token: null });
      });
  });
};

export const onMessagingMessage = callack => {
  const messaging = loadMessaging();
  messaging.onMessage(payload => {
    console.log("Notification Received", payload);
    callack(payload);
  });
};

export default loadMessaging;
