'use strict'
const Observable = require('vigour-observable')

module.exports = new Observable({
  type: 'property',
  inject: require('../subscribe'),
  properties: {
    storeContextKey: true
  },
  child: 'Constructor',
  subscriptionType: true
}, false)
