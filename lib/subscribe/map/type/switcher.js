const merge = require('../merge')
// const hash = require('quick-hash') // avoid this one
const { get$, get$switch } = require('../get')

module.exports = (t, map, prevMap) => {
  const $ = get$(t)
  let key = '$switch-' + t.path().join('-')
  // wrong context
  console.log('CONTEXT???', t.context && t.context.path())

  $[$.length - 1] = key
  if ($.length !== 1) {
    let val = {}
    map = merge(t, $.slice(0, -1), val, map)
    mapSwitch(map, key, t, map, $)
  } else {
    console.log('hello', key)
    mapSwitch(map, key, t, map, $)
  }
  return map
}

function mapSwitch (val, key, t, pmap, $) {
  const self = t.$map(void 0, pmap, true)
  const props = t.get('props')
  const elemProps = t.get('types').element.props
  const mappedProps = {}

  if (!val.props) { val.props = {} }
  val.props[key] = mappedProps

  var len = $.length
  var select = self
  console.warn('should have context', !!t.context, t.path())
  for (let i = 0; i < len; i++) { select = select[$[i]] }
  select._.p = pmap._.p
  select._.$switch = true
  mappedProps.self = select
  if (!select.val) { select.val = 1 }

  // for (let key in props) {
  //   const keyO = key[0]
  //   if (keyO !== '$' && keyO !== '_' && !elemProps[key]) {
  //     const prop = props[key]
  //     const struct = prop.struct
  //     if (struct) { // is element or is property
  //       struct.key = key
  //       if (t.context) {
  //         struct.context = t.context
  //         struct.contextLevel = 1
  //       } else {
  //         struct.context = t._p
  //         struct.contextLevel = 1
  //       }
  //       struct.indexProperty = t
  //       let map = struct.$map(void 0, pmap)
  //       mappedProps[key] = map
  //       map._.p = pmap._.p
  //       map._.$switch = true
  //       if (!map.val) { map.val = 1 }
  //       delete struct.indexProperty
  //     }
  //   }
  // }

  val[key] = get$switch(t)

  return val
}
