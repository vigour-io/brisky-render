import { create, subscribe, puid } from 'brisky-struct'
import render from './render'
import merge from './merge'
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

  renderStyle(elem)
  const subs = elem.$map()
  const tree = t = {}
  const uid = puid(elem)
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
  bstamp.close()

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

  // make setting resolve optional
  node = elem.node = dom
    ? (t._[uid] = merge(t._[uid], dom, elem))
    : t._[uid]
  done(elem, node)
  return node
}
