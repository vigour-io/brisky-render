import widgets from '../widget/widgets' // better to store on the root -- prevent mismatch
import { isWidget } from '../get'

const parent = (tree, pid) => (tree._ && tree._[pid]) ? tree
  : tree._p && parent(tree._p, pid)

export default (t, state, type, subs, tree, id, pid, order) => {
  if (t.isObject && (!t.isElement || t.isText)) {
    const p = parent(tree, pid)
    if (!p) {
      // if (type === 'remove')
      // object subs dont work with on remove or widgets yet -- this is why it fires so often for  the h-lists
      // console.log('cannot find parent for', t.path(), pid, subs, state.inspect(), tree)
      return
    }
    tree = p
    state = p.$t
    if (!state) {
      throw new Error('OBJECT SUBS - NO STATE')
    }
  }

  if (type === 'remove') {
    for (let i = widgets.length - 1; i >= 0; i = i - 3) {
      const wtree = widgets[i]
      let ptree = wtree
      while (ptree) {
        if (tree === ptree) {
          emitRemove(widgets[i - 2], state, wtree, widgets[i - 1])
          widgets.splice(i - 2, 3)
        }
        ptree = ptree._p
      }
    }
    if (onRemove(t) && !isWidget(t)) {
      emitRemove(t, state, tree, id)
    }
  } else if (!tree._) {
    tree._ = {}
  }
  if (!t.render) {
    // console.warn(t)
    return
  }
  return t.render.state(t, state, type, subs, tree, id, pid, order)
}

const emitRemove = (t, state, tree, id) => {
  const data = { target: tree._ && tree._[id], state }
  t.emit('remove', data, state.stamp)
}

const onRemove = (t, key) => t.emitters && t.emitters.remove ||
  t.inherits && onRemove(t.inherits)
