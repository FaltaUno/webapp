import { loadDB } from "../lib/database";
import { normalizeSnap } from "../lib/firebase";

export const allMatches = async function() {
  const db = await loadDB();
  const snap = await db
    .child("matches")
    .orderByKey()
    .once("value");
  let matches = [];
  snap.forEach(child => {
    matches.push(normalizeSnap(child));
  });
  return matches;
};

export const getMatch = async function(key) {
  const db = await loadDB();
  const snap = await db.child(`matches/${key}`).once("value");
  return normalizeSnap(snap);
};
