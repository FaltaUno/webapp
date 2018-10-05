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
          return { permission: true, token: null };
        });
    })
    .catch(err => {
      console.error("Unable to get permission to notify.", err);
      return { permission: false, token: null };
    });
};

export default loadMessaging;
