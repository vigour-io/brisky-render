const emitterProperty = require('brisky-struct/lib/struct')
  .props.on.struct.props.default
const parent = require('../render/dom/parent')
const delegate = require('./delegate')
const listen = require('./listener')

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
    },
    move: (t, val) => {
      t.set({
        mousemove: val,
        touchmove: val
      })
    },
    down: (t, val) => {
      t.set({
        mousedown: val,
        touchstart: val
      })
    },
    up: (t, val) => {
      t.set({
        touchend: val,
        mouseup: val
      })
    }
  }
}

exports.props = {
  hasEvents: {
    type: 'property',
    // sync: false,
    // just do sync nicely and not like smelly ballz
    // also add a prop on state "anonomize"
    subscriptionType: 1, // make it spoecial -- need non-deep variant for this
    $: true,
    render: {
      state (target, s, type, subs, tree, id, pid) {
        const node = parent(tree, pid)
        if (node) {
          if (s) {
            node._sc = s.storeContext()
            node._s = s
          }
          if (!('_' in node)) {
            node._ = target.parent()
          }
        }
      }
    }
  }
}
