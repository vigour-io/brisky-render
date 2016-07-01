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
  noReference: true,
  child: 'Constructor',
  subscriptionType: true
}, false)
