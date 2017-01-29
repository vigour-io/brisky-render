import 'html-element/global-shim'
import { property, element, isStatic } from '../../../static'
import fragment from './fragment'
import { tag } from '../../../../get'
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
    if (!t._noResolve_) {
      node.setAttribute('id', puid(t))
    }
    property(t, node)
    element(t, node)
    tree._[id] = node
    return node
  }
}

injectable.static = t => {
  const nodeType = tag(t)
  const node = document.createElement(nodeType)
  if (!isStatic(t.parent()) && !t._noResolve_) {
    // disable this with a flag
    node.setAttribute('id', puid(t))
  }
  property(t, node)
  element(t, node)
  return node
}
