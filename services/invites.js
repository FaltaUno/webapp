import { loadDB, loadServerValue } from "../lib/database";

export const joinMatch = async function(match, userKey) {
  const db = loadDB();
  const ServerValue = loadServerValue();
  const requestKey = await db.child(`requests`).push().key;
  const request = {
    createdAt: ServerValue.TIMESTAMP,
    matchKey: match.key,
    userKey: userKey,
    requestNotified: false,
    requestRead: false,
    approvalNotified: false,
    approvalRead: false,
    approved: false,
  };

  let updates = {};
  updates[`requests/${requestKey}`] = request;
  updates[`matches/${match.key}/usersRequests/${userKey}`] = { requestKey };
  updates[`users/${userKey}/matchesRequests/${match.key}`] = { requestKey };
  return await db.update(updates);
};
