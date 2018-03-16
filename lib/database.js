import firebase from "firebase/app"
import "firebase/database"
import config from '../config'

// @link: https://github.com/now-examples/next-news/blob/master/lib/db.js
export default function loadDB() {
  try {
    firebase.initializeApp(config.firebase)
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
