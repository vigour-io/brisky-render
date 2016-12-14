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

  if (typeof $any !== 'function') {
    $any = false
  } else {
    key = '$any-' + $any.toString()
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
      console.error('shiiit')
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

  return map
}
