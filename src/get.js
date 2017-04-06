const getPath = (t, path) => {
  var i = 0
  const len = path.length
  while (i < len && (t = t[path[i++]]));
  return t
}

const isWidget = t => t.isWidget !== void 0 ? t.isWidget : t.inherits && isWidget(t.inherits)

// const cache = t => t._cachedNode

const cache = t => t._cachedNode !== void 0
  ? t._cachedNode
  : !('style' in t) && !('attr' in t) && t.inherits && cache(t.inherits)

const tag = t => t.tag || t.inherits && tag(t.inherits)

const get$ = t => t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits)

const get$any = t => t.$any !== void 0 ? t.$any : t.inherits && get$any(t.inherits)

const get$switch = t => t.$switch !== void 0 ? t.$switch : t.inherits && get$switch(t.inherits)

const getType = t => t.subscriptionType || t.inherits && getType(t.inherits)

const getClass = t => t.class !== void 0 ? t.class : t.inherits && getClass(t.inherits)

export { getPath, isWidget, cache, tag, get$, get$any, get$switch, getType, getClass }

