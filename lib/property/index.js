const struct = require('brisky-struct')
const getVal = t => t.val !== void 0 ? t.val : t.inherits && getVal(t.inherits)

module.exports = struct({
  type: 'property',
  inject: [
    require('../index'),
    require('../subscribe')
  ],
  instances: false,
  props: {
    storeContextKey: true,
    default: 'self'
  },
  on: {
    data: (val, stamp, t) => {
      console.log('should fire :/ biaatch')
      if (t._p && t._p._cachedNode && getVal(t)) {
        delete t._p._cachedNode
      }
    }
  },
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
