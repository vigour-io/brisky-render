const getPath = (t, path) => {
  var i = 0
  const len = path.length
  while (i < len && (t = t[path[i++]]));
  return t
}

const cache = t => t._cachedNode !== void 0
  ? t._cachedNode
  : t.inherits && cache(t.inherits)

const tag = t => t.tag || t.inherits && tag(t.inherits)

exports.tag = tag
exports.cache = cache
exports.getPath = getPath
