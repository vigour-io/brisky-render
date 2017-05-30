import { struct } from 'brisky-struct'
import parent from '../render/dom/parent'
import delegate from './delegate'
import listen from './listener'

const emitterProperty = struct.props.on.struct.props.default
const cache = {}
const injectable = {}

const isTouch = typeof window !== 'undefined' && (
  ('ontouchstart' in global ||
    global.DocumentTouch &&
    document instanceof global.DocumentTouch) ||
  navigator.msMaxTouchPoints ||
  false)

const clear = () => { block = null }
// const blockMouse = () => {
//   if (block) clearTimeout(block)
//   block = setTimeout(clear, 300)
// }
var block
var blockClick

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
    click: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        listen(key, e => {
          const d = Date.now() - blockClick
          return d < 500 && delegate(key, e)
        })
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    },
    down: (t, val, key) => {
      if (!cache[key]) {
        cache[key] = true
        if (!isTouch) {
          listen('mousedown', e => {
            blockClick = Date.now()
            // if (!block) delegate(key, e)
            delegate(key, e)
          })
        } else {
          listen('touchstart', e => {
            blockClick = Date.now()
            // blockMouse()
            delegate(key, e)
          })
        }
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    }
    // up: (t, val, key) => {
    //   if (!cache[key]) {
    //     cache[key] = true
    //     listen('mouseup', e => {
    //       delegate(key, e)
    //       // !block && delegate(key, e)
    //     })
    //     listen('touchend', e => {
    //       // blockMouse()
    //       delegate(key, e)
    //     })
    //   }
    //   t._p.set({ hasEvents: true }, false)
    //   emitterProperty(t, val, key)
    // }
  }
}

if (isTouch) {
  injectable.on.props.move = (t, val) => t.set({ touchmove: val })
  // injectable.on.props.down = (t, val) => t.set({ touchstart: val })
  injectable.on.props.up = (t, val) => t.set({ touchend: val })
} else {
  injectable.on.props.move = (t, val) => t.set({ mousemove: val })
  // injectable.on.props.down = (t, val) => t.set({ mousedown: val })
  injectable.on.props.up = (t, val) => t.set({ mouseup: val })
}

injectable.props = {
  hasEvents: {
    type: 'property',
    subscriptionType: 'switch',
    forceSubscriptionMethod: 's',
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
