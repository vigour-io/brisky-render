const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')
const setVal = require('../val')
const { get$, get$switch, get$any } = require('../../../get')

module.exports = (t, map) => {
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
    // extra = $any
    extra = $any
    $any = $any.val
    key = '$any-' + $any.toString()
    // typeof $any !== 'function'
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

// stuff thats still wrong
const mergeExtra = (target, map) => {
  if (typeof map === 'object') {
    for (let i in target) {
      let m = map[i]
      let t = target[i]
      if (i !== 'val') {
        if (!(i in map)) {
          map[i] = t
        } else {
          if (typeof t !== 'object') {
            if (t === true) {
              if (m !== true || m.val !== true) {
                m.val = true
              }
            } else {
              if (m !== true || !m.val || m.val !== true) {
                m.val = t
              }
            }
          } else {
            mergeExtra(t, m)
          }
        }
      } else if (typeof t !== 'function') {
        if (map.val !== true || !map.val) {
          map.val = t
        }
      }
    }
  } else {
    console.warn('merging $any into boolean - not supported yet')
  }
}
