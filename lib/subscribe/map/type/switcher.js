const merge = require('../merge')
// const hash = require('quick-hash') // avoid this one

module.exports = (t, map, prevMap) => {
  const $ = t.$
  let key = '$switch-' + t.path().join('-')
  $[$.length - 1] = key
  if ($.length !== 1) {
    let val = {}
    map = merge(t, t.$.slice(0, -1), val, map)
    mapSwitch(map, key, t, map, $)
  } else {
    console.log('hello', key)
    mapSwitch(map, key, t, map, $)
  }
  return map
}

function mapSwitch (val, key, t, pmap, $) {
  const props = t.get('props')
  const elemProps = t.get('types').element.props
  if (!val.props) { val.props = {} }
  const mappedProps = {}
  val.props[key] = mappedProps
  for (let key in props) {
    const keyO = key[0]
    if (keyO !== '$' && keyO !== '_' && !elemProps[key]) {
      const prop = props[key]
      const struct = prop.struct
      if (struct) { // is element or is property
        if (t.context) {
          struct.context = t.context
          struct.contextLevel = 1
        } else {
          struct.context = t._p
          struct.contextLevel = 1
        }
        struct.switchProperty = t // test with context will probably go wrong...
        let map = struct.$map(void 0, pmap)
        mappedProps[key] = map
        map._.p = pmap._.p
        map._.$switch = true
        delete struct.switchProperty
      }
    }
  }
  const selfMap = t.$map(void 0, pmap, true)
  let len = $.length
  let tt = selfMap
  for (let i = 0; i < len; i++) { tt = tt[$[i]] }
  tt._.p = pmap._.p
  tt._.$switch = true
  mappedProps.self = tt
  val[key] = t.$switch
  return val
}
