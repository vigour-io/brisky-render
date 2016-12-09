const emitterProperty = require('brisky-struct/lib/struct').props.on.struct.props.default
// make everything avaible on the top
const parent = require('../render/dom/parent')

const delegate = require('./delegate')

const listen = require('./listener')

 // addListener(key, (e) => delegate(key, e))

// check if event allrdy there
// delegate (+context)
// subscribe

// const register = () => {

// }

const cache = {}

exports.on = {
  props: {
    error: {},
    remove: {},
    default: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        listen(key, (e) => delegate(key, e))
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    }
  }
}

// 'use strict'
// const getParent = require('brisky-core/lib/render/dom/parent')

exports.props = {
  hasEvents: {
    // make a flag when subscribed or something
    type: 'property',
    // sync: false,
    // just do sync nicely and not like smelly ballz
    // subscriptionType: 1, // make it spoecial -- need non-deep variant for this
    $: true,
    render: {
      state (target, s, type, subs, tree, id, pid) {
        const node = parent(tree, pid)
        if (node) {
          console.log(node)
          // if (s) {
          //   node._sc = s.storeContext()
          //   node._s = s
          // }
          if (!('_' in node)) {
            node._ = target.parent()
          }
        }
      }
    }
  }
}
