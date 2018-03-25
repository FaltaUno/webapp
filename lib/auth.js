import { loadFB } from "./firebase";
import "firebase/auth";

// @link: https://github.com/now-examples/next-news/blob/master/lib/db.js
const loadAuth = () => {
  const fb = loadFB();
  //return firebase.database().ref('v0')
  return fb.auth();
};

export const onAuthStateChanged = callback => {
  return loadAuth().onAuthStateChanged(callback);
};

export const signInAnonymously = () => {
  return loadAuth()
    .signInAnonymously()
    .catch(function(error) {
      console.error("AUTH", error.code, error.message);
    });
};
