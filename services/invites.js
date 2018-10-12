import { loadDB, loadServerValue, normalizeSnap } from "../lib/database";
import { notifyInviteRequestToMatchCreator } from "./pushNotification";
import { getUser } from "./users";

export const getInvitesRef = () => {
  return loadDB().child(`invites`);
};

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

export const requestInvite = async (match, user, email, phone, matchCreator) => {
  const db = loadDB();
  const ServerValue = loadServerValue();

  // Invite
  const inviteKey = await db.child(`invites`).push().key;
  const invite = {
    createdAt: ServerValue.TIMESTAMP,
    matchKey: match.key,
    userKey: user.key,
    userEmail: email,
    userPhone: phone,
    requestRead: false,
    approved: false,
    approvalRead: false
  };

  // Invite relations
  const inviteRelation = { date: ServerValue.TIMESTAMP };

  let updates = {};
  updates[`invites/${inviteKey}`] = invite;
  updates[`matches/${match.key}/invites/${inviteKey}`] = inviteRelation;
  updates[`users/${user.key}/invites/${inviteKey}`] = inviteRelation;
  // User contact info
  updates[`users/${user.key}/email`] = email;
  updates[`users/${user.key}/contactInfo`] = { phone };

  await db.update(updates);
  // Send the push notification, no matters the response
  notifyInviteRequestToMatchCreator(matchCreator, match, user);
  return invite;
};

export const getUnreadInviteRequestsCountForMatchAdmin = userKey => {
  // Get the user matches and count the unread requests for everyone of them
  return getUser(userKey).then(user => {
    let count = 0;
    let reqs$ = [];
    Object.keys(user.matches).map(matchKey => {
      reqs$.push(
        getInvitesRef()
          .orderByChild(`matchKey`)
          .equalTo(matchKey)
          .once("value", snaps => {
            snaps.forEach(snap => {
              const invite = snap.val();
              if (!invite.requestRead) {
                count++;
              }
            });
          })
      );
    });

    return Promise.all(reqs$).then(() => count);
  });
};
