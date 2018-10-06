import { loadDB, loadServerValue, normalizeSnap } from "../lib/database";

export const getUsersRef = () => {
  return loadDB().child(`users`);
};

export const allUsers = async () => {
  const snap = await getUsersRef()
    .orderByKey()
    .once("value");
  let matches = [];
  snap.forEach(child => {
    matches.push(normalizeSnap(child));
  });
  return matches;
};

export const getUser = async key => {
  const snap = await getUsersRef()
    .child(key)
    .once("value");
  return normalizeSnap(snap);
};

export const unregisterMessagingToken = async (key, token) => {
  const user = await getUsersRef().child(key);
  return user.child(`messagingTokens/${token}`).remove();
};

export const registerMessagingToken = async (key, token) => {
  const user = await getUsersRef().child(key);
  return user.child(`messagingTokens/${token}`).set(true);
};
