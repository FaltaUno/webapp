import ref from './database'

export default async function fetch() {
  const query = ref.child('matches').orderByKey()
  const snap = await query.once('value')
  let matches = []
  snap.forEach((child) => {
    let match = child.val()
    match.key = child.key
    matches.push(match)
  })
  return matches
}
