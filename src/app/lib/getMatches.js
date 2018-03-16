import loadDB from "./database"

export default async function fetch() {
  const db = await loadDB()
  const snap = await db
    .child("matches")
    .orderByKey()
    .once("value")
  let matches = []
  snap.forEach(child => {
    let match = child.val()
    match.key = child.key
    matches.push(match)
  })
  return matches
}
