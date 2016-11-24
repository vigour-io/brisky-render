const isNull = t => t.val === null || t.inherits && isNull(t.inherits)
const { get } = require('brisky-struct/lib/get')

module.exports = (t, map, prevMap) => {
  var changed
  const keys = t.keys()

  if (keys) {
    let i = keys.length
    while (i--) {
      let p = get(t, keys[i])
      if (p && !isNull(p) && p.$map) {
        if (exec(p, map, prevMap)) { changed = true }
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
