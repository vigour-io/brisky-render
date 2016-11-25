'use strict'
const getParent = require('brisky-core/lib/render/dom/parent')
const props = require('brisky-core/lib/render/static').property
const ua = require('vigour-ua/navigator')

exports.types = {
  style: require('./type')
}

exports.properties = {
  style: {
    type: 'property',
    render: {
      static (target, pnode) {
        props(target, pnode)
      },
      state (target, s, type, stamp, subs, tree, id, pid) {
        if (type !== 'remove') {
          const pnode = getParent(type, stamp, subs, tree, pid)
          if (!pnode._styleStaticParsed) {
            props(target, pnode)
            pnode._styleStaticParsed = true
          }
        }
      }
    },
    inject: [
      require('./px'),
      require('./transform')
    ],
    child: {
      type: 'style'
    },
    properties: {
      order: {
        name: ua.browser === 'ie' && ua.version === 10 ? 'msFlexOrder' : 'order'
      }
    }
  }
}
