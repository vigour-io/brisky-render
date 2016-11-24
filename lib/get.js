const getPath = (t, path) => {
  var i = 0
  const len = path.length
  while (i < len && (t = t[path[i++]]));
  return t
}

const cache = t => t._cachedNode !== void 0
  ? t._cachedNode
  : t.inherits && cache(t.inherits)

exports.cache = cache
exports.getPath = getPath
