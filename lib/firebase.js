export const normalizeSnap = snap => {
  let match = snap.val();
  match.key = snap.key;
  return match;
};

export default normalizeSnap;
