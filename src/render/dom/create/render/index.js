import 'html-element/global-shim'
import { property, element } from '../../../static'
import fragment from './fragment'
import { tag, isStatic } from '../../../../get'
import { puid } from 'brisky-struct'

const injectable = {}

export default injectable

injectable.state = (t, type, subs, tree, id, pnode) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    // disable this with a flag
    node.setAttribute('id', puid(t))
    property(t, node)
    element(t, node)
    tree._[id] = node
    return node
  }
}

injectable.static = t => {
  // if it comes from another static should not add id
  const nodeType = tag(t)
  const node = document.createElement(nodeType)
  // disable this with a flag
  if (!isStatic(t.parent())) {
    node.setAttribute('id', puid(t))
  }
  // may need to add a class
  property(t, node)
  element(t, node)
  return node
}
