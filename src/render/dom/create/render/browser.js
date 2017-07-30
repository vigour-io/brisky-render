// TESTBROWSER!!!!???
import {
  get,
  puid } from 'brisky-struct'
import fragment from './fragment'
import { property, element, isStatic, staticProps } from '../../../static'
import { cache, tag } from '../../../../get'
import nidium from './nidium'

const isNidium = global.__nidium__

const injectable = isNidium ? nidium : {}
const xmlns = 'http://www.w3.org/2000/svg'

export default injectable

if (!isNidium) {
  const resolveState = (t, pnode, id, state) => {
    if (!pnode && t.node) {
      t.node.removeAttribute('id')
      return t.node
    } else {
      const children = pnode.childNodes
      if (children) {
      // console.log(state.path(), puid(state))
        // id = (id * 33 ^ puid(state)) >>> 0
        var i = children.length
        while (i--) {
          if (children[i].getAttribute('haha')) {
            console.log('ok here it goes', children[i], id, state.inspect())
          }
        if (children[i].id == id) { // eslint-disable-line
          children[i].removeAttribute('id')
          return children[i]
        }
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

  const createElement = nodeType => {
    if (nodeType === 'div') {
      return document.createElement(nodeType)
    } else {
      return nodeType === 'svg' ||
      nodeType === 'path' ||
      nodeType === 'g' ||
      nodeType === 'rect' ||
      nodeType === 'circle' ||
      nodeType === 'ellipse' ||
      nodeType === 'polyline' ||
      nodeType === 'polygon' ||
      nodeType === 'linearGradient' ||
      nodeType === 'defs' ||
      nodeType === 'image' ||
      nodeType === 'use' ||
      nodeType === 'mask' ||
      nodeType === 'stop'
      ? document.createElementNS(xmlns, nodeType)
      : document.createElement(nodeType)
    }
  }

// indexes need to be copied when adding from pre-render
  injectable.static = (t, pnode, noResolve) => {
  // the cache node is nto good of course!
  // console.log('static')
    const cached = cache(t)
    var node
    if (cached && isStatic(t)) {
      node = staticFromCache(cached)
    } else {
      if (cached) {
        throw new Error('static but its not static..... very strange....' + t.path())
      } else {
        const nodeType = tag(t)
        if (nodeType === 'fragment') {
          console.error('not handeling static fragments yet')
        } else {
          node = createElement(nodeType)
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
    var cached = cache(t) //! t.resolve
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
        if (t.resolve) {
          // console.log('resolve...?')
          if (!tree._p || !tree._p._key !== 'client') {
            node = resolveState(t, pnode, id, state)
            if (node) {
              // console.log('resolved!', node)
              node.style.boxShadow = '0px 0px 10px red'
              node.style.borderTop = '1px solid blue'
              // node.style.opacity = 0.5
            }
          }
          if (!node) {
            node = createElement(nodeType)
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
          node = createElement(nodeType)
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
    return node
  }
}
