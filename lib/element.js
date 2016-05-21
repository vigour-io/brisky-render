'use strict'
const Observable = require('vigour-observable')
const emitNoContext = require('vigour-observable/lib/emitter/emit/emit')
const element = new Observable({
  type: 'element',
  components: {
    property: require('./property')
  },
  properties: {
    tag: { val: 'div' },
    namespace: true, // later to props this is a strange location...
    isElement: { val: true }
  },
  on: {
    Child: {
      define: { emit }
    }
  },
  Child: 'Constructor'
}, false)

const emitters = element.__on.properties
emitters.removeEmitter.base.define({ emit })
emitters.data.base.define({ emit })

element.components.element = element

element.inject(
  require('./subscribe'),
  require('./render/dom/element'),
  require('./keys'),
  require('./property/order'),
  require('./property/group'),
  require('./property/text'),
  require('./property/html'),
  require('./widget')
)

module.exports = element.Constructor

function emit (bind, stamp, val) {
  emitNoContext(this, bind, stamp, val)
}
