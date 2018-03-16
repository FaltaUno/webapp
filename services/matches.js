import loadDB from "../lib/database";

const normalize = snap => {
  let match = snap.val();
  match.key = snap.key;
  return match;
};

export const all = async function() {
  const db = await loadDB();
  const snap = await db
    .child("matches")
    .orderByKey()
    .once("value");
  let matches = [];
  snap.forEach(child => {
    matches.push(normalize(child));
  });
  return matches;
};

export const get = async function(key) {
  const db = await loadDB();
  const snap = await db
    .child(`matches/${key}`)
    .once("value");
  return normalize(snap);
};
