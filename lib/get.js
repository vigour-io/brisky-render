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

const get$ = t => t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits)

const get$any = t => t.$any !== void 0 ? t.$any : t.inherits && get$any(t.inherits)

const get$switch = t => t.$switch !== void 0 ? t.$switch : t.inherits && get$switch(t.inherits)

const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

const isGroup = t => t.isGroup !== void 0
  ? t.isGroup
  : t.inherits && isGroup(t.inherits)

exports.get$ = get$
exports.get$any = get$any
exports.get$switch = get$switch

exports.getType = getType
exports.isGroup = isGroup

exports.tag = tag
exports.cache = cache
exports.getPath = getPath
