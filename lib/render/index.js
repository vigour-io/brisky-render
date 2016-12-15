import struct from 'brisky-struct'
import { subscribe } from 'brisky-struct/lib/subscribe'
import render from './render'
import element from '../element'
import { getPath, get$, get$any } from '../get'
import bstamp from 'brisky-stamp'

export default (elem, state, cb) => {
  if (!elem.inherits) {
    elem = element.create(elem)
  }
  const subs = elem.$map()
  const tree = {}
  const stamp = bstamp.create('render')
  if (state === void 0) {
    render(state, 'new', subs, tree)
    if (cb) { cb(subs, tree, elem) }
  } else {
    if (!state || !state.inherits) { state = struct(state) }
    render(state, 'new', subs, tree)
    if (cb) {
      subscribe(state, subs, (s, type, su, t) => {
        render(s, type, su, t)
        cb(subs, tree, elem, s, type, su, t)
      }, tree)
      cb(subs, tree, elem)
    } else {
      subscribe(state, subs, render, tree)
    }
  }
  bstamp.close(stamp)
  const uid = elem.uid()

  const $ = get$(elem)

  if ($) {
    let t
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
    return t._[uid]
  } else {
    return tree._[uid]
  }
}
