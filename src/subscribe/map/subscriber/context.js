import { cuid } from 'brisky-struct'

const contextKey = t => t.storeContextKey !== void 0
  ? t.storeContextKey
  : t.inherits && contextKey(t.inherits)

export default t => {
  if (contextKey(t)) {
    const key = t.parent().key
    return key ? 'c' + key + '-' + cuid(t) : 'c' + cuid(t)
  } else {
    return 'c' + cuid(t)
  }
}
