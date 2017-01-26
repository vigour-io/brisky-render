import { cuid } from 'brisky-struct'

const contextKey = t => t.storeContextKey !== void 0
  ? t.storeContextKey
  : t.inherits && contextKey(t.inherits)

export default t => {
  if (contextKey(t)) {
    const key = t.parent().key
    console.log(key ? key + '-' + cuid(t) : cuid(t))

    return key ? key + '-' + cuid(t) : cuid(t)
  } else {
    // console.log(cuid(t))
    return cuid(t)
  }
}
