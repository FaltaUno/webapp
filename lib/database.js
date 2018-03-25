import { loadFB } from "./firebase";
import "firebase/database";

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

export const normalizeSnap = snap => {
  let match = snap.val();
  match.key = snap.key;
  return match;
};

export default loadDB;
