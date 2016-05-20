'use strict'
const Observable = require('vigour-observable')
const element = new Observable({
  type: 'element',
  components: {
    property: require('./property')
  },
  properties: {
    node: { val: 'div' },
    namespace: true, // later to props this is weird...
    isElement: { val: true }
  },
  Child: 'Constructor'
}, false)

element.components.element = element
element.inject(
  require('./subscribe'),
  require('./render/dom/element'),
  require('./keys'),
  require('./property/order'),
  require('./property/group'),
  require('./property/text'),
  require('./widget')
)

element.defaultSubscription = 1
module.exports = element.Constructor
