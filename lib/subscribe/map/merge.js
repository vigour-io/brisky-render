import mergeS from './subscriber/merge'
import { getPath } from '../../get'
import set from './set'
import val from './val'

export default (t, subs, val, map) => {
  const field = getPath(map, subs)
  if (field) {
    if (subs.length > 1) {
      for (let i = 0, len = subs.length - 1, m = map, key; i < len; i++) {
        key = subs[i]
        m = m[key]
        if (m.$blockRemove) { m.$blockRemove = false }
      }
    }
    merge(t, field, val)
    return field
  } else {
    return set(t, val, map, subs)
  }
}

const merge = (t, a, b) => {
  if (b && typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    if (typeof b === 'object') {
      if (!b._) {
        b._ = {}
      }
      b._.p = a._.p
    }
    for (let i in b) {
      if (i !== '$keys') {
        if (i === 'props') {
          if (!a.props) {
            a.props = {}
          }
          for (let j in b.props) {
            a.props[j] = b.props[j]
            for (let n in b.props[j]) {
              if (typeof b.props[j][n] === 'object') {
                b.props[j][n]._.p = a._.p
              }
            }
          }
        } else if (i !== '_') {
          if (typeof a[i] === 'object') {
            merge(t, a[i], b[i])
          } else if (!a[i]) {
            if (typeof b[i] === 'object' && b[i]._) {
              b[i]._.p = a
            }
            a[i] = b[i]
          } else if (i === 'val') {
            // alse remove this specific true thing
            if (a.val !== b.val && b.val === true) {
              // pretty wrong since i need the info of the t in the def
              val(t, a, true)
            }
          } else {
            let prev = a[i]
            // maybe copy sync?
            a[i] = { _: { p: a } }
            val(t, a[i], prev)
            merge(t, a[i], b[i])
          }
        } else {
          mergeS(a._, b._)
        }
      }
    }
  }
}
