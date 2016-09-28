'use strict'
module.exports = (target, path) => {
  const len = path.length
  var i = 0
  while (i < len && (target = target[path[i++]]));
  return target
}
