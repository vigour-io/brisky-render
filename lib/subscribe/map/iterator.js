'use strict'

module.exports = function iterator (target, map, prevMap) {
  var changed
  const keys = target.keys()

  for (let i = keys.length - 1; i >= 0; i--) {
    let p = target[keys[i]]
    if (p && p.val !== null) {
      if (p.$map) {
        if (exec(p, map, prevMap)) {
          changed = true
        }
      }
    }
  }

  return changed
}

function exec (p, map, prevMap) {
  const change = p.$map(map, prevMap)
  if (change) {
    return true
  } else {
    // this can be removed the 1 thing
    p.isStatic = true
  }
}
