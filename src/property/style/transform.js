import parent from '../../render/dom/parent'
import { get$ } from '../../get'
import prefix from './prefix'

const transform = prefix.transform || 'transform'

const setTransform = (val, store, node) => {
  if ('x' in store || 'y' in store || 'z' in store) {
    const translate3d = `translate3d(${(store.x
      ? unit(store.x, 'px')
      : '0px')}, ${(store.y
        ? unit(store.y, 'px')
        : '0px')}, ${(store.z)})`
    val = val ? (val + ' ' + translate3d) : translate3d
  }

  if ('scale' in store) {
    const scale = `scale(${store.scale})`
    val = val ? (val + ' ' + scale) : scale
  }

  if ('rotate' in store) {
    const rotate = `rotate(${store.rotate}deg)`
    val = val ? (val + ' ' + rotate) : rotate
  }

  node.style[transform] = val
}

const unit = (val, unit) => typeof val === 'number' && !isNaN(val)
  ? val + unit
  : val

export default {
  type: 'group',
  render: {
    static (t, node, store) {
      var val = t.compute()
      if (!val || typeof val !== 'string') { val = '' }
      setTransform(val, store, node)
    },
    state (t, s, type, subs, tree, id, pid, store) {
      var val = s && get$(t) ? t.compute(s, s) : t.compute()
      if (!val || typeof val !== 'string') { val = '' }
      const node = parent(tree, pid)
      if (node) { setTransform(val, store, node) }
    }
  }
}
