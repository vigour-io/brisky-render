const struct = require('brisky-struct')
const getVal = t => t.val === null || t.inherits && getVal(t.inherits)

module.exports = struct({
  type: 'property',
  inject: [
    require('../keys'),
    require('../subscribe')
  ],
  props: {
    storeContextKey: true,
    default: 'self'
  },
  on: {
    data: (val, stamp, t) => {
      console.log('should fire :/')
      if (t._p) {
        if (getVal(t)) {
          t._p._cachedNode = null
        }
      }
    }
  }
  // define: {
  //   extend: {
  //     set (method, val, stamp, nocontext, isNew) {
  //       if (this._parent) {
  //         const proto = Object.getPrototypeOf(this)
  //         if (proto.val) {
  //           this._parent._cachedNode = null
  //         }
  //       }
  //       return method.call(this, val, stamp, nocontext, isNew)
  //     }
  //   }
  // },
  // noReference: true,
  subscriptionType: true
}, false)
