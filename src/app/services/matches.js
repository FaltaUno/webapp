import loadDB from "./db"

const normalize = (snap) => {
  let match = snap.val()
  match.key = snap.key
  return match
}

export const all = async () => {
  const db = await loadDB()
  const snap = await db
    .child("matches")
    .orderByKey()
    .once("value")
  let matches = []
  snap.forEach((child) => {
    matches.push(normalize(child))
  })
  return matches
}

export const get = async (key) => {
  const db = await loadDB()
  const snap = await db
    .child(`matches/${key}`)
    .once("value")
  return normalize(snap)
}

export default {
  all,
  get,
}
