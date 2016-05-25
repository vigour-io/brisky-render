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
    namespace: true
  },
  tag: 'div',
  on: {
    child: { define: { emit } }
  },
  define: { isElement: { value: true } },
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
  require('./property/order'),
  require('./property/group'),
  require('./property/text'),
  require('./property/html'),
  require('./widget')
)

module.exports = element.Constructor

function emit (bind, data, stamp) {
  emitNoContext(this, bind, data, stamp)
}
