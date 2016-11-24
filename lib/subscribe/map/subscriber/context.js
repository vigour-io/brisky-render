const contextKey = t => t.storeContextKey !== void 0
  ? t.storeContextKey
  : t.inherits && contextKey(t.inherits)

exports.id = t => {
  if (contextKey(t)) {
    const key = t.parent().key
    return key ? 'c' + key + '-' + genCid(t) : 'c' + genCid(t)
  } else {
    return 'c' + genCid(t)
  }
}

const genCid = t => {
  if (t.context) {
    if (t.contextLevel === 1) {
      return t.uid() + '' + genCid(t.context) // wrong
    } else {
      return t.uid() + '' + genCid(t._p)
    }
  } else {
    return t.uid()
  }
}
