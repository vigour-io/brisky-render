import { create } from 'brisky-struct'
import findindex from '../findindex'
import subscribe from '../subscribe'

export default create({
  type: 'property',
  inject: [
    findindex,
    subscribe
  ],
  instances: false,
  props: {
    storeContextKey: true,
    default: 'self'
  },
  on: {
    data: (val, stamp, t) => {
      if (t._p && t._p._cachedNode === void 0) {
        t._p._cachedNode = null
      }
    }
  },
  subscriptionType: true
  // noReference: true,
}, false)
