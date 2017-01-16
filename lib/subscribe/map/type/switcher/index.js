import merge from '../../merge'
import hash from 'string-hash' // avoid this one
import { get$, get$switch } from '../../../../get'
import { parse, get } from 'brisky-struct'

export default (t, map, prevMap) => {
  const $ = get$(t)
  let key = '$switch' + hash(t.path().join('') + t.uid())
  $[$.length - 1] = key
  if ($.length !== 1) {
    let val = {}
    map = merge(t, $.slice(0, -1), val, map)
    mapSwitch(map, key, t, map, $)
  } else {
    mapSwitch(map, key, t, map, $)
  }
  return map
}

const helper = (struct, subs, tree, key) => {
  const store = subs.props[key]
  const $exec = store.$exec
  var result = $exec(struct, subs, tree, key)
  if (result === true) {
    result = store.self
  } else {
    const type = typeof result
    if (type === 'number' || type === 'string') {
      result = store[result]
    }
  }
  return result
}

function mapSwitch (val, pkey, t, pmap, $) {
  const self = t.$map(void 0, pmap, true)
  const props = get(t, 'props')
  const types = get(t, 'types')
  var blackList
  if (types.element) {
    blackList = types.element.props
  } else {
    blackList = types.struct.props
  }
  const mappedProps = {}
  if (!val.props) { val.props = {} }
  val.props[pkey] = mappedProps

  var $switch = get$switch(t)
  if (typeof $switch === 'object') {
    $switch = parse($switch)
    mappedProps.$exec = $switch.val
    const n = {}
    for (let key in $switch) {
      n[key] = $switch[key]
    }
    n.val = helper
    $switch = n
    n.props = val.props // bit weird...
  } else {
    mappedProps.$exec = $switch
    $switch = helper
  }

  var len = $.length
  var select = self
  for (let i = 0; i < len; i++) { select = select[$[i]] }
  select._.p = pmap._.p
  mappedProps.self = select
  if (!select.val) select.val = 1

  for (let key in props) {
    const keyO = key[0]
    if (
      keyO !== '$' && keyO !== '_' &&
      (!blackList[key] || blackList[key] !== props[key])
    ) {
      const prop = props[key]
      const struct = prop.struct
      if (struct && struct.$map) { // is element or is property
        struct.key = key
        struct._c = !t._c || isAncestor(t._c, t._p) ? t._p : t._c
        struct._cLevel = 1
        struct.indexProperty = t
        let map = struct.$map(void 0, pmap)
        mappedProps[key] = map
        map._.p = pmap._.p
        if (!map.val) { map.val = 1 }
        delete struct.indexProperty
      }
    }
  }

  val[pkey] = $switch
  return val
}

const isAncestor = (c, p) => {
  while (p) {
    if (p.key === 'types') return
    if (p === c) return true
    p = p._p
  }
}
