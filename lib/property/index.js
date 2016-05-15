'use strict'
const clearKeys = require('vigour-observable').prototype.clearKeys

module.exports = new Observable({
  type: 'property',
  inject: require('../subscribe'),
  Child: 'Constructor',
  defaultSubscription: true,
  define: {
    clearKeys (target) {
      this._staticProps = void 0
      clearKeys.apply(this, arguments)
    }
  }
}, false)
