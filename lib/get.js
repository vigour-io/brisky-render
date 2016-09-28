'use strict'
module.exports = (target, path) => {
  if (typeof path === 'string') {
    path = path.split('.')
  }
  const len = path.length
  var i = 0
  while (i < len && (target = target[path[i++]]));
  return target
}
