import fetch from "isomorphic-unfetch";

//TODO: Localize when the app is detached

const notify = (token, data) => {
  data.to = token;
  data.badge = 1;
  console.log(process.env.PUSH_URI);

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
  return notify(matchCreator.pushToken, {
    title: `${user.displayName} quiere jugar en ${match.name}`,
    body: `Ingresá para aceptarlo o rechazarlo`,
    data: {
      action: "myMatch.inviteRequest",
      matchKey: match.key,
      userKey: user.key
    }
  });
};
