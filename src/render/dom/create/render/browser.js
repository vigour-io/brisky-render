// TESTBROWSER!!!!???
import { get, puid } from 'brisky-struct'
import fragment from './fragment'
import { property, element, isStatic, staticProps } from '../../../static'
import { cache, tag } from '../../../../get'

const injectable = {}

export default injectable

const resolve = (t, pnode) => {
  if (!pnode && t.node) {
    t.node.removeAttribute('id') // maybe unnsecary
    return t.node
  } else {
    const children = pnode.childNodes
    const id = puid(t)
    var i = children.length
    // can remove the residues by checking elems after and jsut chec if ! id
    while (i--) {
      if (children[i].id == id) { //eslint-disable-line
        // children[i].id = null
        children[i].removeAttribute('id') // maybe unnsecary
        return children[i]
      }
    }
  }
}

const hasStateProperties = t => {
  const keys = t.keys()
  if (keys) {
    let i = keys.length
    while (i--) {
      let check = get(t, keys[i])
      if (!check.isElement && !isStatic(check)) {
        return true
      }
    }
  }
}

injectable.static = (t, pnode) => {
  // giveme parent node

  const cached = cache(t)
  var node
  if (cached && isStatic(t)) {
    node = cached.cloneNode(true)
    if (cached._index) node._index = cached._index
    if (cached._last) node._last = cached._last
  } else {
    if (cached) {
      node = cached.cloneNode(false)
      // need to get
      if (cached._propsStaticParsed) {
        node._propsStaticParsed = true
      }
    } else {
      const nodeType = tag(t)
      if (nodeType === 'fragment') {
        console.error('not handeling static fragments yet')
      } else {
        if (t.resolve) {
          node = resolve(t, pnode)
          // set somehting like isStatic
          if (!node) {
            node = document.createElement(nodeType)
            property(t, node)
            element(t, node)
          } else {
            // console.log('RESOLVED [DYNAMIC]', t.path())
            // node.removeAttribute('id')
          }
        } else {
          node = document.createElement(nodeType)
          property(t, node)
          element(t, node)
        }
        t._cachedNode = node
      }
    }
  }
  return node
}

injectable.state = (t, type, subs, tree, id, pnode) => {
  const cached = cache(t)
  var node
  // @todo: this copies unwanted styles / props -- need to add an extra clonenode for this
  if (cached) {
    node = cached.cloneNode(false)
    tree._[id] = node
    if (cached._last) {
      node._last = cached._last
    }
    if (cached._index) {
      node._index = cached._index
    }
  } else {
    const nodeType = tag(t)
    if (nodeType === 'fragment') {
      return fragment(t, pnode, id, tree)
    } else {
      // will become an argument in render or something
      if (t.resolve) {
        node = resolve(t, pnode)
        if (!node) {
          node = document.createElement(nodeType)
        } else {
          // console.log('RESOLVED [STATIC]', t.path())
          // node.removeAttribute('id')
        }
      } else {
        node = document.createElement(nodeType)
      }
      const hasStaticProps = staticProps(t).length
      if (hasStaticProps) {
        t._cachedNode = node
        property(t, node)
        if (hasStateProperties(t)) {
          node = t._cachedNode.cloneNode(false)
        }
      }
    }
    tree._[id] = node
  }
  element(t, node)
  return node
}
