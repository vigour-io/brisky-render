import widgets from '../widget/widgets' // better to store on the root -- prevent mismatch
import { isWidget } from '../get'

const parent = (tree, pid) => (tree._ && tree._[pid]) ? tree
  : tree._p && parent(tree._p, pid)

export default (t, state, type, subs, tree, id, pid, order) => {
  if (t.isObject) {
    // if (subs.val) {
    const p = parent(tree, pid)
    tree = p
    state = p.$t
    if (!state) {
      console.log('wtf', p)
    }
    // }
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
  return t.render.state(t, state, type, subs, tree, id, pid, order)
}

const emitRemove = (t, state, tree, id) => {
  const data = { target: tree._ && tree._[id], state }
  t.emit('remove', data, state.stamp)
}

const onRemove = (t, key) => t.emitters && t.emitters.remove ||
  t.inherits && onRemove(t.inherits)
