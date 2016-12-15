export default (a, b) => {
  if (b.t) {
    if (!a.t) { a.t = {} }
    for (let uid in b.t) {
      a.t[uid] = b.t[uid]
    }
    if (!b.s) {
      a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
    }
  }
  if (b.s) {
    if (!a.s) { a.s = {} }
    for (let uid in b.s) {
      a.s[uid] = b.s[uid]
    }
    a.sList = a.sList ? a.sList.concat(b.sList) : b.sList
    a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
  }
}
