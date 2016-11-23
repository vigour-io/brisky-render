module.exports = (target, path) => {
  var i = 0
  const len = path.length
  while (i < len && (target = target[path[i++]]));
  return target
}
