const struct = require('brisky-struct')

module.exports = struct({
  type: 'property',
  inject: [
    require('../findindex'),
    require('../subscribe')
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
