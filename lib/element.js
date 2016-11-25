const struct = require('brisky-struct')
// const l = require('brisky-struct/lib/struct')

const element = struct({
  type: 'element', // does this even work?
  types: {
    property: require('./property')
  },
  // noReference: true, // this does not exists anymore.. shit props default? else need to parse references...
  instances: false,
  define: {
    // uid () {
    //   return ' |' + l.uid.call(this) + '-' + this.key + '| '
    // },
    isElement: true // not nessecary
  },
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
    require('./property/style')
  ]
}, false)

element.set({ types: { element } }, false)

// element.inject(
// require('./widget')
// )

module.exports = element
