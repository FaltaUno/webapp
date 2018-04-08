import { loadDB, loadServerValue, normalizeSnap } from "../lib/database";

export const getInviteRef = key => {
  return loadDB().child(`invites/${key}`);
};

export const getInvites = async keys => {
  let invites$ = [];
  keys.map(key => invites$.push(getInvite(key)));

  const invites = await Promise.all(invites$);
  return invites;
};

export const getInvite = async key => {
  const snap = await getInviteRef(key).once("value");
  return normalizeSnap(snap);
};

export const requestInvite = async function(match, user, phone) {
  const db = loadDB();
  const ServerValue = loadServerValue();

  // Invite
  const inviteKey = await db.child(`invites`).push().key;
  const invite = {
    createdAt: ServerValue.TIMESTAMP,
    matchKey: match.key,
    userKey: user.key,
    requestNotified: false,
    requestRead: false,
    approvalNotified: false,
    approvalRead: false,
    approved: false
  };

  // Invite relations
  const inviteRelation = { date: ServerValue.TIMESTAMP };

  let updates = {};
  updates[`invites/${inviteKey}`] = invite;
  updates[`matches/${match.key}/invites/${inviteKey}`] = inviteRelation;
  updates[`users/${user.key}/invites/${inviteKey}`] = inviteRelation;
  // User contact info
  updates[`users/${user.key}/contactInfo`] = { phone };

  return await db.update(updates).then(() => invite);
};
