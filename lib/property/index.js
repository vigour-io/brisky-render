'use strict'
const Observable = require('vigour-observable')

module.exports = new Observable({
  type: 'property',
  inject: [
    require('../keys'),
    require('../subscribe'),
    require('./store')
  ],
  properties: {
    storeContextKey: true
  },
  child: 'Constructor',
  subscriptionType: true
}, false)
