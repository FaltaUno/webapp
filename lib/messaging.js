import { loadFB } from "./firebase";
import "firebase/messaging";

let firebaseMessaging = false;

export const loadMessaging = () => {
  //return firebase.database().ref('v0')
  if(! firebaseMessaging){
    firebaseMessaging = loadFB().messaging()
    firebaseMessaging.usePublicVapidKey(process.env.FIREBASE_MESSAGING_VAPID_KEY);
  }
  return firebaseMessaging;
};

export default loadMessaging;
