import parent from '../render/dom/parent'
import { get$ } from '../get'
import { getKeys } from 'brisky-struct'

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
    subscriptionType: 'shallow',
    render: {
      static (t, node, store) {
        var val = t.compute()
        if (typeof val === 'object') val = ''
        if (getKeys(t)) val = parseStore(val, store)
        setClassName(val, node)
      },
      state (t, s, type, subs, tree, id, pid, store) {
        const node = parent(tree, pid)
        if (node) {
          let val = s && get$(t) ? t.compute(s, s) : t.compute()
          if (typeof val === 'object') val = ''
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
  const tron = node.getAttribute('data-style')
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
