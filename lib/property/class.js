import parent from '../render/dom/parent'
import { get$ } from '../get'
import { get, getKeys } from 'brisky-struct'

const injectable = {}

export default injectable

// const getStyletron = t => t.styletron !== void 0
//   ? t.styletron
//   : t.inherits && getStyletron(t.inherits)

// const hasStyletron = t => t.style !== void 0
//   ? getStyletron(t.style)
//   : t.inherits && hasStyletron(t.inherits)

injectable.props = {
  class: {
    type: 'group',
    storeContextKey: true,
    subscriptionType: true,
    props: { useKey: true },
    render: {
      static (t, node, store) {
        var val = t.compute()
        if (val === true || get(t, 'useKey')) {
          const key = get(t.parent(), 'key')
          val = typeof val === 'string' ? (val + ' ' + key) : key
        } else if (typeof val === 'object') {
          val = ''
        }
        if (getKeys(t)) val = parseStore(val, store)
        setClassName(val, node)
      },
      state (t, s, type, subs, tree, id, pid, store) {
        const node = parent(tree, pid)
        if (node) {
          let val = s && get$(t) ? t.compute(s, s) : t.compute()
          if (val === true || get(t, 'useKey')) {
            const key = parseKey(t, id)
            val = typeof val === 'string' ? (val + ' ' + key) : key
          } else if (typeof val === 'object') {
            val = ''
          }
          if (getKeys(t)) val = parseStore(val, store)
          setClassName(val, node)
        }
      }
    }
  }
}

const parseStore = (val, store) => {
  for (let key in store) {
    let fieldval = store[key]
    if (fieldval === true) {
      fieldval = key
    }
    if (fieldval !== false) {
      if (val) {
        val += ' ' + fieldval
      } else {
        val = fieldval
      }
    }
  }
  return val
}

const setClassName = (val, node) => {
  const tron = node.getAttribute('data-styletron')
  if (val) {
    if (tron) val = val + tron
    node.className = val
  } else if ('className' in node) {
    if (tron) {
      node.className = tron
    } else {
      node.removeAttribute('class')
    }
  }
}

// const setClassName = (val, node) => {
//   if (val) {
//     node.className = val
//   } else if ('className' in node) {
//     node.removeAttribute('class')
//   }
// }

const parseKey = (t, pid) => {
  if (pid[0] === 'c') {
    for (let i = pid.length - 1; i >= 0; i--) {
      if (pid[i] === '-') {
        return pid.slice(1, i)
      }
    }
  } else {
    return get(t.parent(), 'key')
  }
}
