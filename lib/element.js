'use strict'
// const Observable = require('vigour-observable')
// const emitNoContext = require('vigour-observable/lib/emitter/emit/emit')
const struct = require('brisky-struct')

const element = struct({
  type: 'element', // does this even work?
  types: {
    // property: require('./property')
  },
  // on: {
  //   child: { define: { emit } }
  // },
  // noReference: true, // this does not exists anymore.. shit props default? else need to parse references...
  instances: false,
  define: {
    isElement: true // not nessecary
  },
  props: {
    tag: true,
    default: 'self'
  },
  tag: 'div',
  inject: [
    require('./subscribe'),
    require('./keys'),
    require('./render/dom/element'),
    require('./property/text')
  ]
}, false)

// const emitters = element.emitters.properties
// emitters.remove.base.define({ emit })
// emitters.data.base.define({ emit })
// element.types.element = element

// element.inject(

  // require('./property/group'),
  // require('./property/text'),
  // require('./property/html'),
  // require('./widget')
// )

module.exports = element

// function emit (bind, data, stamp) {
//   emitNoContext(this, bind, data, stamp)
// }
