import 'html-element/global-shim'
import { property, element } from '../../../static'
import fragment from './fragment'
import { tag } from '../../../../get'
import { puid } from 'brisky-struct'

const injectable = {}

export default injectable

injectable.state = (t, type, subs, tree, id, pnode, state) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
    if (!t._noResolve_) {
      node.setAttribute('id', (id * 33 ^ puid(state)) >>> 0)
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
  property(t, node)
  element(t, node)
  return node
}
