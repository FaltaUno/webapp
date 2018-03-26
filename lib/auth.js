import { loadFB } from "./firebase";
import { loadDB } from "./database";
import "firebase/auth";

// @link: https://github.com/now-examples/next-news/blob/master/lib/db.js
export const loadAuth = () => {
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

export const loadFacebookAuthProvider = () => {
  const fb = loadFB();
  return new fb.auth.FacebookAuthProvider();
};

export const parseUser = async firebaseUser => {
  const userRef = loadDB().child(`users/${firebaseUser.uid}`);
  let snap = await userRef.once("value");
  let user = snap.val();
  // If the user is new, create with default values
  if (user === null) {
    user = firebaseUser.providerData[0];
    user.createdAt = new Date(firebaseUser.metadata.creationTime).getTime();

    // Default values
    user.firstTime = true;
    user.phoneVerified = false;
    user.locationPermission = false;

    // Operation data
    user.available = false;
    user.filterByDistance = true;
    user.distance = 15;
  }

  user.key = snap.key;
  return user;
};
