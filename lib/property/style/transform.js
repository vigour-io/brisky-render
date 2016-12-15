import parent from '../../render/dom/parent'
import ua from 'vigour-ua/navigator'
import { appendUnit as unit } from './util'
import { get$ } from '../../get'

const transform = ua.prefix ? ua.prefix + 'Transform' : 'transform'
const injectable = {}

export default injectable

injectable.props = {
  transform: {
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
}

function setTransform (val, store, node) {
  if ('x' in store || 'y' in store) {
    const translate3d = `translate3d(${(store.x
      ? unit(store.x, 'px')
      : '0px')}, ${(store.y
        ? unit(store.y, 'px')
        : '0px')}, 0px)`
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
