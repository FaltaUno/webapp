import firebase from "firebase/app";
import "firebase/database";

const loadFB = () => {
  try {
    firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    });
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }

  return firebase;
};

// @link: https://github.com/now-examples/next-news/blob/master/lib/db.js
export const loadDB = () => {
  const fb = loadFB();
  //return firebase.database().ref('v0')
  return fb.database().ref();
};

export const loadServerValue = () => {
  const fb = loadFB();
  return fb.database.ServerValue;
};

export default loadDB;
