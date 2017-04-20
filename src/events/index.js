import { struct } from 'brisky-struct'
import parent from '../render/dom/parent'
import delegate from './delegate'
import listen from './listener'

const emitterProperty = struct.props.on.struct.props.default
const cache = {}
const injectable = {}

const clear = () => { block = null }
const blockMouse = () => {
  if (block) clearTimeout(block)
  block = setTimeout(clear, 300)
}
var block

export default injectable

injectable.on = {
  props: {
    error: {},
    remove: {},
    default: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        listen(key, e => delegate(key, e))
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
    down: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        listen('mousedown', e => {
          !block && delegate(key, e)
        })
        listen('touchstart', e => {
          blockMouse()
          delegate(key, e)
        })
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    },
    up: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        listen('mouseup', e => {
          !block && delegate(key, e)
        })
        listen('touchend', e => {
          blockMouse()
          delegate(key, e)
        })
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    }
  }
}

injectable.props = {
  hasEvents: {
    type: 'property',
    // sync: false,
    // this is the time for sync: false....
    subscriptionType: 'switch',
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
