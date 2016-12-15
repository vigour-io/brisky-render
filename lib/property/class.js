import parent from '../render/dom/parent'
import { get$ } from '../get'
import { get } from 'brisky-struct/lib/get'

const injectable = {}

export default injectable

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
        const keys = t.keys()
        setClassName(keys && keys.length ? parseStore(val, store) : val, node)
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
          const keys = t.keys()
          setClassName(keys && t.keys().length ? parseStore(val, store) : val, node)
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
  if (val) {
    node.className = val
  } else if ('className' in node) {
    node.removeAttribute('class')
  }
}

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
