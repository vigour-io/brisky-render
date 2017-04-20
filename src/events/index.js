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

export default injectable

injectable.on = {
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

if (isTouch) {
  injectable.on.props.move = (t, val) => t.set({ touchmove: val })
  injectable.on.props.down = (t, val) => t.set({ touchstart: val })
  injectable.on.props.up = (t, val) => t.set({ touchend: val })
} else {
  injectable.on.props.move = (t, val) => t.set({ mousemove: val })
  injectable.on.props.down = (t, val) => t.set({ mousedown: val })
  injectable.on.props.up = (t, val) => t.set({ mouseup: val })
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
