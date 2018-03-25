import { loadDB } from "../lib/database";
import { normalizeSnap } from "../lib/firebase";

export const allMatches = async function() {
  const db = loadDB();
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

export const getMatchRef = function(key) {
  return loadDB().child(`matches/${key}`)
}

export const getMatch = async function(key) {
  const snap = await getMatchRef(key).once("value");
  return normalizeSnap(snap);
};

export const onMatchChanged = async function(key, callback) {
  return getMatchRef(key).on("child_changed", callback)
};
