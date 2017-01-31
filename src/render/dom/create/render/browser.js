// TESTBROWSER!!!!???
import { get, puid } from 'brisky-struct'
import fragment from './fragment'
import { property, element, isStatic, staticProps } from '../../../static'
import { cache, tag } from '../../../../get'

const injectable = {}

export default injectable

const resolve = (t, pnode, id, state) => {
  if (!pnode && t.node) {
    t.node.removeAttribute('id') // maybe unnsecary
    return t.node
  } else {
    const children = pnode.childNodes
    id = (id * 33 ^ puid(state)) >>> 0
    var i = children.length
    while (i--) {
      if (children[i].id == id) { //eslint-disable-line
        children[i].removeAttribute('id') // maybe unnsecary
        // use something else then id
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
          // node = resolve(t, pnode)
          // set somehting like isStatic
          if (!node) {
            node = document.createElement(nodeType)
            property(t, node)
            element(t, node)
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

// fn for cached

injectable.state = (t, type, subs, tree, id, pnode, state) => {
  // need to re-add cache ofc
  var cached // = cache(t)
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
        node = resolve(t, pnode, id, state)
        if (!node) {
          // console.log('CREATE ELEM')
          node = document.createElement(nodeType)
          node.style.border = '1px solid red'
          node.style.padding = '5px'
          node.style.background = 'pink'
          const hasStaticProps = staticProps(t).length
          if (hasStaticProps) {
            t._cachedNode = node
            property(t, node)
            if (hasStateProperties(t)) {
              node = t._cachedNode.cloneNode(false)
            }
          }
        } else {
          // console.log('RESOLVED [STATE]', t.path())
          // node.removeAttribute('id')
        }
      } else {
        // console.log('2. CREATE ELEM')
        node = document.createElement(nodeType)
        node.style.border = '1px solid blue'
        node.style.padding = '5px'
        node.style.background = 'purple'
        const hasStaticProps = staticProps(t).length
        if (hasStaticProps) {
          t._cachedNode = node
          property(t, node)
          if (hasStateProperties(t)) {
            node = t._cachedNode.cloneNode(false)
          }
        }
      }
    }
    tree._[id] = node
  }
  element(t, node)
  return node
}
