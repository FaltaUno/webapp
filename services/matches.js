import { loadDB, normalizeSnap } from "../lib/database";
import { getInvite } from "./invites";

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
  return loadDB().child(`matches/${key}`);
};

export const getMatch = async function(key) {
  const snap = await getMatchRef(key).once("value");
  return normalizeSnap(snap);
};

export const onMatchChanged = async function(match, callback) {
  return getMatchRef(match.key).on("child_changed", child => {
    const updatedMatch = Object.assign({}, match);
    updatedMatch[child.key] = child.val();
    return callback(updatedMatch);
  });
};
