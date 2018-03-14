import firebase from "firebase/app";
import "firebase/database";

import Config from '../config'


// @link: https://github.com/now-examples/next-news/blob/master/lib/db.js
function initDatabase() {
  try {
    firebase.initializeApp(Config.firebase)
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack)
    }
  }

  //return firebase.database().ref('v0')
  return firebase.database().ref()
}

export default initDatabase()
