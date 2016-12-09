const struct = require('brisky-struct')

const element = struct({
  type: 'element',
  types: {
    property: require('./property')
  },
  instances: false,
  define: { isElement: true }, // unnesecary code
  props: {
    tag: true,
    default: 'self'
  },
  tag: 'div',
  inject: [
    require('./subscribe'),
    require('./findindex'),
    require('./render/dom/element'),
    require('./property/text'),
    require('./property/html'),
    require('./property/group'),
    require('./property/attr'),
    require('./property/class'),
    require('./property/style'),
    require('./widget'),
    require('./events')
  ]
}, false)

element.set({ types: { element } }, false)

module.exports = element
