const struct = require('brisky-struct')

const element = struct({
  type: 'element', // does this even work?
  types: {
    property: require('./property')
  },
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
    require('./index'),
    require('./render/dom/element'),
    require('./property/text'),
    require('./property/html')
  ]
}, false)

// element.inject(

  // require('./property/group'),
  // require('./widget')
// )

module.exports = element
