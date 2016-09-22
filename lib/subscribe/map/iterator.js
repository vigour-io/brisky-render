'use strict'

module.exports = function iterator (target, map, prevMap) {
  var changed

  if (global.log) {
    console.info('iterator', target.__c)
  }

  const keys = target.keys()
  for (let i = keys.length; i >= 0; i--) {
    let p = target[keys[i]]
    if (p && p.val !== null) {
      if (p.$map) {
        let change = p.$map(map, prevMap)
        if (change) {
          if (!changed) { changed = true }
        } else {
          p.isStatic = change === false ? 1 : true
        }
      }
    }
  }
  return changed
}
