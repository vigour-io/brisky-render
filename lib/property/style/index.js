const getParent = require('../lib/render/dom/parent')
const { property } = require('../render/static')

// not good enough -- need to parse it (for server side)
const ua = require('vigour-ua/navigator')

exports.types = {
  style: require('./type')
}

exports.props = {
  style: {
    type: 'property',
    render: {
      static (t, pnode) {
        property(t, pnode)
      },
      state (t, s, type, subs, tree, id, pid) {
        if (type !== 'remove') {
          const pnode = getParent(type, subs, tree, pid)
          if (!pnode._styleStaticParsed) {
            property(t, pnode)
            pnode._styleStaticParsed = true
          }
        }
      }
    },
    inject: [
      require('./px')
      // require('./transform')
    ],
    props: {
      default: { type: 'style' },
      order: {
        // put ua info on top for server or from render for example
        // or add both for now
        name: ua.browser === 'ie' && ua.version === 10 ? 'msFlexOrder' : 'order'
      }
    }
  }
}
