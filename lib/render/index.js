import { create, subscribe } from 'brisky-struct'
import render from './render'
import element from '../element'
import { getPath, get$, get$any } from '../get'
import bstamp from 'brisky-stamp'
import { render as renderStyle, done } from '../property/style/sheet'

export default (elem, state, cb, cb2) => {
  var dom, node, t
  if (elem instanceof global.Element) {
    dom = elem
    elem = state
    state = cb
    cb = cb2
  }
  if (!elem.inherits) elem = element.create(elem)

  if (dom) {
    if (elem.body && !elem.body.tag) elem.body.tag = 'body'
    if (elem.head && !elem.head.tag) elem.head.tag = 'head'
  }

  renderStyle(elem)
  const subs = elem.$map()
  const tree = t = {}
  const uid = elem.uid() - 1e4

  const stamp = bstamp.create('render')
  if (state === void 0) {
    render(state, 'new', subs, tree)
    if (cb) { cb(subs, tree, elem) }
  } else {
    if (!state || !state.inherits) { state = create(state) }
    render(state, 'new', subs, tree)
    if (cb) {
      subscribe(state, subs, (s, type, su, t) => {
        render(s, type, su, t)
        cb(subs, tree, elem, s, type, su, t)
      }, tree)
      cb(subs, tree, elem)
    } else {
      state.subscribe(subs, render, true, tree)
    }
  }
  bstamp.close(stamp)

  const $ = get$(elem)

  if ($) {
    // need to do this as well
    let path = $
    if (get$any(elem)) {
      if (elem.$.length === 1) {
        path = []
        t = tree
      } else {
        path = $.slice(0, -1)
        t = tree
        t = getPath(tree, path)
      }
    } else {
      t = getPath(tree, $)
    }
    if (!t) {
      const obj = {}
      let len = path.length
      let i = 0
      let s = obj
      while (i < len && (s = s[path[i++]] = {}));
      state.set(obj)
      t = getPath(tree, path)
    }
  }

  node = elem.node = dom ? (t._[uid] = merge(t._[uid], dom)) : t._[uid]
  done(elem, node)
  return node
}

const merge = (node, dom) => {
  const children = node.childNodes
  let i = children.length
  while (i--) {
    let child = children[0]
    let tag = child.tagName
    let replaced
    if (tag === 'BODY' || tag === 'HEAD') {
      let j = dom.childNodes.length
      while (j--) {
        if (dom.childNodes[j].tagName === tag) {
          // replaced = true
          dom.removeChild(dom.childNodes[j])
          // merge(child, dom.childNodes[j])
          break
        }
      }
    }
    if (!replaced) dom.appendChild(child)
  }
  return dom
}
