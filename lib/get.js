export const getPath = (t, path) => {
  var i = 0
  const len = path.length
  while (i < len && (t = t[path[i++]]));
  return t
}

export const isWidget = t => t.isWidget !== void 0 ? t.isWidget : t.inherits && isWidget(t.inherits)

export const cache = t => t._cachedNode !== void 0
  ? t._cachedNode
  : t.inherits && cache(t.inherits)

export const tag = t => t.tag || t.inherits && tag(t.inherits)

export const get$ = t => t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits)

export const get$any = t => t.$any !== void 0 ? t.$any : t.inherits && get$any(t.inherits)

export const get$switch = t => t.$switch !== void 0 ? t.$switch : t.inherits && get$switch(t.inherits)

export const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)
