import { loadDB, loadServerValue } from "../lib/database";

export const requestInvite = async function(match, user) {
  const db = loadDB();
  const ServerValue = loadServerValue();
  const inviteKey = await db.child(`invites`).push().key;
  const invite = {
    createdAt: ServerValue.TIMESTAMP,
    matchKey: match.key,
    userKey: user.key,
    requestNotified: false,
    requestRead: false,
    approvalNotified: false,
    approvalRead: false,
    approved: false,
  };

  let updates = {};
  updates[`invites/${inviteKey}`] = invite;
  updates[`matches/${match.key}/usersInvites/${user.key}`] = { inviteKey };
  updates[`users/${user.key}/matchesInvites/${match.key}`] = { inviteKey };
  return await db.update(updates);
};
