import create from './create'
import { findParent, isFragment } from '../fragment'
import { tag } from '../../get'
import parent from './parent'

const createStatic = create.static
const createState = create.state

// check for null as well -- move this to get
const getRemove = t => t.remove || t.inherits && getRemove(t.inherits)

const hasRemove = t => t.emitters && getRemove(t.emitters) ||
  t.inherits && hasRemove(t.inherits)

const getRender = t => t.render || t.inherits && getRender(t.inherits)

const hasRender = t => t.emitters && getRender(t.emitters) ||
  t.inherits && hasRender(t.inherits)

const removeFragmentChild = (node, pnode) => {
  for (let i = 1, len = node.length; i < len; i++) {
    if (isFragment(node[i])) {
      removeFragmentChild(node[i], pnode)
    } else {
      pnode.removeChild(node[i])
    }
  }
}

const injectable = {}

export default injectable

injectable.props = {
  staticIndex: true,
  _cachedNode: true
}

injectable.render = {
  static: createStatic,
  state (t, s, type, subs, tree, id, pid, order) {
    var node = tree._ && tree._[id]
    var pnode
    if (type === 'remove') {
      if (node) {
        pnode = parent(tree, pid)
        if (pnode) {
          if (tag(t) === 'fragment') {
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            removeFragmentChild(node, pnode)
          } else if (!hasRemove(t)) {
            if (isFragment(pnode)) {
              // add tests for this
              for (let i = 0, len = pnode.length; i < len; i++) {
                if (pnode[i] === node) {
                  pnode.splice(i, 1)
                  break
                }
              }
              pnode = pnode[0]
            }
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            pnode.removeChild(node)
          }
        }
        delete tree._[id]
      }
    } else if (!node) {
      node = createState(t, s, type, subs, tree, id, pid, order)
      // const onrender = hasRender(t)
      // if (onrender) {
      //   console.log('got render')
      // }
    }
    return node
  }
}

console.log('xxx')