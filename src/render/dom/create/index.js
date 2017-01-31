import render from './render'
import parent from '../parent'
import append from './append'
import { isFragment } from '../../fragment'
import { tag } from '../../../get'

const renderStatic = render.static
const renderState = render.state
const appendStatic = append.static
const appendState = append.state
const injectable = {}

export default injectable

injectable.static = (t, pnode) => {
  const node = renderStatic(t, pnode)
  // dont append if you allrdy have a pnode
  if (!node.parentNode) {
    appendStatic(t, pnode, node)
  }
  if (t.hasEvents) { node._ = t }
  return node
}

injectable.state = (t, state, type, subs, tree, id, pid, order) => {
  const pnode = parent(tree, pid)
  const node = renderState(t, type, subs, tree, id, pnode, state)
  if (pnode) { // remove this
    if (tag(t) !== 'fragment' && !node.parentNode) {
      appendState(t, pnode, node, subs, tree, id, order)
    } else if (isFragment(pnode)) {
      pnode.push(node)
    }
  }
  return node
}
