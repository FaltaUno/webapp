import { loadDB } from "../lib/database";
import { normalizeSnap } from "../lib/firebase";

export const allUsers = async function() {
  const db = await loadDB();
  const snap = await db
    .child("users")
    .orderByKey()
    .once("value");
  let matches = [];
  snap.forEach(child => {
    matches.push(normalizeSnap(child));
  });
  return matches;
};

export const getUser = async function(key) {
  const db = await loadDB();
  const snap = await db.child(`users/${key}`).once("value");
  return normalizeSnap(snap);
};

