// TESTBROWSER!!!!???
import { get, puid } from 'brisky-struct'
import fragment from './fragment'
import { property, element, isStatic, staticProps } from '../../../static'
import { cache, tag } from '../../../../get'

const injectable = {}

export default injectable

const resolveState = (t, pnode, id, state) => {
  if (!pnode && t.node) {
    t.node.removeAttribute('id')
    return t.node
  } else {
    const children = pnode.childNodes
    id = (id * 33 ^ puid(state)) >>> 0
    var i = children.length
    while (i--) {
      if (children[i].id == id) { // eslint-disable-line
        children[i].removeAttribute('id')
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

const staticFromCache = (cached) => {
  const node = cached.cloneNode(true)
  if (cached._index) node._index = cached._index
  if (cached._last) node._last = cached._last
  return node
}

// indexes need to be copied when adding from pre-render
injectable.static = (t, pnode, noResolve) => {
  // the cache node is nto good of course!
  const cached = cache(t)
  var node
  if (!t.resolve && cached && isStatic(t)) {
    node = staticFromCache(cached)
  } else {
    if (cached) {
      throw new Error('static but its not static..... very strange....' + t.path())
    } else {
      const nodeType = tag(t)
      if (nodeType === 'fragment') {
        console.error('not handeling static fragments yet')
      } else {
        node = document.createElement(nodeType)
        property(t, node)
        element(t, node, true)
        t._cachedNode = node
      }
    }
  }
  return node
}

// fn for cached

injectable.state = (t, type, subs, tree, id, pnode, state) => {
  // need to re-add cache ofc
  var cached = !t.resolve && cache(t)
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
    element(t, node)
  } else {
    const nodeType = tag(t)
    if (nodeType === 'fragment') {
      return fragment(t, pnode, id, tree)
    } else {
      // will become an argument in render or something
      if (t.resolve) {
        // dont resolve this
        if (!tree._p || !tree._p._key !== 'client') {
          node = resolveState(t, pnode, id, state)
        }
        if (!node) {
          node = document.createElement(nodeType)
          const hasStaticProps = staticProps(t).length
          if (hasStaticProps) {
            t._cachedNode = node
            property(t, node)
            if (hasStateProperties(t)) {
              node = t._cachedNode.cloneNode(false)
            }
          }
          element(t, node)
        }
      } else {
        node = document.createElement(nodeType)
        const hasStaticProps = staticProps(t).length
        if (hasStaticProps) {
          t._cachedNode = node
          property(t, node)
          if (hasStateProperties(t)) {
            node = t._cachedNode.cloneNode(false)
          }
        }
        element(t, node)
      }
    }
    tree._[id] = node
  }
  // element(t, node)
  return node
}
