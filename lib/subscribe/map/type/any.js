import merge from '../merge'
import subscriber from '../subscriber'
import iterator from '../iterator'
import setVal from '../val'
import { get$, get$switch, get$any } from '../../../get'

export default (t, map) => {
  const props = t.get('props')
  const child = props.default.struct

  const $ = get$(t)

  child.key = 'default'
  if (t.context || t !== child._p) {
    child.context = t
    child.contextLevel = 1
  }

  var key = '$any'
  var $any = get$any(t)
  var extra

  if (typeof $any === 'function') {
    key = '$any-' + $any.toString()
  } else if (typeof $any === 'object') {
    extra = $any
    $any = $any.val
    // need more unqieness make a method
    key = '$any-' + $any.toString() + Object.keys(extra).join('')
  } else {
    $any = false
  }

  if ($.length !== 1) {
    const path = $.slice(0, -1)
    const val = { val: 1 } // wrong for switch .. what to do
    let walk = map
    let exists
    val[key] = child.$map(void 0, exists ? walk : val)

    if ($any) {
      val[key].$keys = $any
    }

    if (!val[key].val) {
      if (!get$switch(child)) {
        setVal(child, val[key], 1)
      }
    }
    // if (!child.$test && child.sync !== false && val.$any._.sync === true) {
    //   val.$any._.sync = 1
    // }
    map = merge(t, path, val, map)
  } else {
    if (map[key]) {
      merge(t, [ key ], child.$map(void 0, map), map)
    } else {
      map.$any = child.$map(void 0, map)
    }

    if (!map.$any.val) {
      if (!get$switch(child)) {
        setVal(child, map[key], 1)
      }
    }

    if ($any) {
      map[key].$keys = $any
    }
    // if (!child.$test && child.sync !== false && map.$any._.sync === true) {
    //   map.$any._.sync = 1
    // }
  }

  iterator(t, map)
  subscriber(map, t, 't')

  if (extra) {
    mergeExtra(extra, map[key])
  }

  return map
}

const $keys = (map, i, t) => {
  if (typeof map.$keys !== 'object') {
    map.$keys = { val: map.$keys }
  }
  if (i === 'parent') {
    for (let j in t) {
      map.$keys[j] = t[j]
    }
  } else if (i === 'root') {
    map.$keys.root = {}
    for (let j in t) {
      map.$keys.root[j] = t[j]
    }
  } else {
    map.$keys[i] = t
  }
}

const mergeExtra = (target, map, deep) => {
  for (let i in target) {
    let t = target[i]
    if (!deep && (i === 'root' || i === 'parent')) {
      $keys(map, i, t)
    } else {
      let type = typeof t
      if (type !== 'object' && type !== 'function') {
        t = target[i] = { val: t }
      }
      if (i === 'val') {
        if (!deep) {
          if (!map.val) {
            map.val = t
          } else if (t === true && map.val === 1) {
            map.val = t
          }
        }
      } else {
        if (!(i in map)) {
          map[i] = t
        } else {
          mergeExtra(t, map[i], true)
        }
      }
    }
  }
}
