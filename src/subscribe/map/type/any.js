import merge from '../merge'
import subscriber from '../subscriber'
import iterator from '../iterator'
import setVal from '../val'
import { get$, get$switch, get$any } from '../../../get'
import { parse, puid } from 'brisky-struct'

export default (t, map) => {
  const props = t.get('props')
  const child = props.default.struct

  const $ = get$(t)

  child.key = 'default'
  if (t._c || t !== child._p) {
    child._c = t
    child._cLevel = 1
  }

  var key = '$any'
  var $any = get$any(t)
  var extra

  if (typeof $any === 'function') {
    key = '$any' + puid(t)
  } else if (typeof $any === 'object') {
    extra = parse($any)

    $any = $any.val
    key = '$any' + puid(t)
  } else {
    $any = false
  }

  if ($.length !== 1) {
    const path = $.slice(0, -1)
    const val = { val: 'switch' } // wrong for switch .. what to do
    val[key] = child.$map(void 0, val)

    if ($any) {
      val[key].$keys = $any
    }

    if (!val[key].val) {
      if (!get$switch(child)) {
        setVal(child, val[key], 'switch')
      }
    }

    map = merge(t, path, val, map)
  } else {
    if (map[key]) {
      merge(t, [ key ], child.$map(void 0, map), map)
    } else {
      map[key] = child.$map(void 0, map)
    }

    if (!map[key].val) {
      if (!get$switch(child)) {
        setVal(child, map[key], 'switch')
      }
    }

    if ($any) {
      map[key].$keys = $any
    }
  }

  iterator(t, map)
  subscriber(map, t, 't')

  if (extra) {
    mergeExtra(extra, map[key])
    const $keys = map[key].$keys
    for (let field in $keys) {
      // tmp expiriment
      if (field !== '$object' && field !== 'props' && field !== 'val' && field !== 'root') {
        // console.log(field, $keys[field])
        if (!map[key][field]) {
          map[key][field] = $keys[field]
        }
      }
    }
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
    if (!deep) { //  && (i === 'root' || i === 'parent')
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
          } else if (t === true && map.val === 'switch') {
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
