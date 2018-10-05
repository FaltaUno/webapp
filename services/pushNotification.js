import fetch from "isomorphic-unfetch";

import { getUnreadInviteRequestsCountForMatchAdmin } from "./invites";
//TODO: Localize when the app is detached

const notify = async (user, data) => {
  data.to = user.pushToken;
  data.badge = await getUnreadInviteRequestsCountForMatchAdmin(user.key);
  return fetch(process.env.PUSH_URI, {
    mode: "no-cors",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data)
  });
};

export const notifyInviteRequestToMatchCreator = (
  matchCreator,
  match,
  user
) => {
  return notify(matchCreator, {
    title: `${user.displayName} quiere jugar en ${match.name}`,
    body: `Ingresá para aceptarlo o rechazarlo`,
    data: {
      action: "myMatch.inviteRequest",
      matchKey: match.key,
      userKey: user.key
    }
  });
};
