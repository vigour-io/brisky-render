const contextKey = t => t.storeContextKey !== void 0
  ? t.storeContextKey
  : t.inherits && contextKey(t.inherits)

export default t => {
  if (contextKey(t)) {
    const key = t.parent().key
    return key ? 'c' + key + '-' + genCid(t) : 'c' + genCid(t)
  } else {
    return 'c' + genCid(t)
  }
}

// this will become a method in struct
const genCid = t => {
  if (t._c) {
    if (t._cLevel === 1) {
      return (t.uid() - 1e4) + '' + genCid(t._c) // wrong
    } else {
      return (t.uid() - 1e4) + '' + genCid(t._p)
    }
  } else {
    return t.uid() - 1e4
  }
}
