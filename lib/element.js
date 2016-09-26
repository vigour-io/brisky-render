'use strict'
const Observable = require('vigour-observable')
const emitNoContext = require('vigour-observable/lib/emitter/emit/emit')
const element = new Observable({
  type: 'element',
  types: {
    property: require('./property')
  },
  properties: {
    tag: true,
    namespace: true // for svg (not being used now)
  },
  tag: 'div',
  on: {
    child: { define: { emit } }
  },
  noReference: true,
  instances: false,
  define: {
    isElement: true,
    extend: {
      set (set, val, stamp, nocontext, isNew) {
        if (!stamp) { stamp = false }
        return set.call(this, val, stamp, nocontext, isNew)
      }
    }
  },
  child: 'Constructor'
}, false)

const emitters = element.emitters.properties
emitters.remove.base.define({ emit })
emitters.data.base.define({ emit })
element.types.element = element

element.inject(
  require('./subscribe'),
  require('./render/dom/element'),
  require('./keys'),
  require('./property/group'),
  require('./property/text'),
  require('./property/html'),
  require('./widget')
)

module.exports = element.Constructor

function emit (bind, data, stamp) {
  emitNoContext(this, bind, data, stamp)
}
