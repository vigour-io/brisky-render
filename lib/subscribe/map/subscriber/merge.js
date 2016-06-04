'use strict'
module.exports = function mergeS (a, b) {
  if (b.t) {
    for (let uid in b.t) {
      a.t[uid] = b.t[uid]
    }
    if (!b.s) {
      a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
    }
  }

  if (b.s) {
    for (let uid in b.s) {
      a.s[uid] = b.s[uid]
    }
    a.sList = a.sList ? a.sList.concat(b.sList) : b.sList
    a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
  }

  if (b.d) {
    for (let uid in b.d) {
      a.d[uid] = b.d[uid]
    }
    a.dList = a.dList ? a.dList.concat(b.dList) : b.dList
  }
}
