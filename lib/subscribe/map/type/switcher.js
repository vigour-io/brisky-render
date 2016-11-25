const merge = require('../merge')
const subscriber = require('../subscriber')
const iterator = require('../iterator')
// const hash = require('quick-hash') // avoid this one

module.exports = (t, map, prevMap) => {
  const $ = t.$

  // remove hash if possible saves lots of kbs
  let key = '$switch-' + t.path().join('-')
  //  let key = '$switch' + hash(t.path().join('.'))
  $[$.length - 1] = key
  if ($.length !== 1) {
    let val = {}
    // val[key] = {}
    map = merge(t, t.$.slice(0, -1), val, map)
    // console.log('----', map)
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

  // need to include / exclude key

  for (let key in props) {
    const keyO = key[0]
    if (keyO !== '$' && keyO !== '_' && !elemProps[key]) {
      console.log('switch key', key)

      const prop = props[key]
      const struct = prop.struct
      if (struct && struct.isElement) {

        if (t.context) {
          // check if this is good
          struct.context = t.context
          struct.contextLevel = 1
        } else {
          struct.context = t._p
          struct.contextLevel = 1
        }

        console.log('hello!', key)

        // let p = struct._p
        // struct._p = t._p
        let map = struct.$map(void 0, pmap)

        mappedProps[key] = map

        map._.p = pmap._.p
        map._.$switch = true

        // if (map.val) {
        //   map.val = 1
        // }
      }
    }
  }

  // default
  console.log('go go go:', val, key)

  // mappedProps.self = { _: { p: pmap._.p } }
  const selfMap = t.$map(void 0, pmap, true)

  let len = $.length
  let tt = selfMap
  for (let i = 0; i < len; i++) {
    tt = tt[$[i]]
  }
  tt._.p = pmap._.p
  tt._.$switch = true
  mappedProps.self = tt
  // console.log('self', selfMap)
  // iterator(t, mappedProps.self)
  // subscriber(mappedProps.self, t, 't')

  val[key] = t.$switch

  return val
}
