require('html-element/global-shim')
import { property, element } from '../../../static'
import fragment from './fragment'
import { tag } from '../../../../get'

const injectable = {}

export default injectable

injectable.state = (t, type, subs, tree, id, pnode) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = document.createElement(nodeType)
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
