'use strict'
const Observable = require('vigour-observable')

module.exports = new Observable({
  type: 'property',
  inject: [
    require('../keys'),
    require('../subscribe')
  ],
  properties: {
    storeContextKey: true
  },
  define: {
    extend: {
      set (method, val, stamp, nocontext, isNew) {
        if (this._parent) {
          const proto = Object.getPrototypeOf(this)
          if (proto.val) {
            this._parent._cachedNode = null
          }
        }
        return method.call(this, val, stamp, nocontext, isNew)
      }
    }
  },
  noReference: true,
  child: 'Constructor',
  subscriptionType: true
}, false)
