const merge = require('../merge')
const iterator = require('../iterator')
const subscriber = require('../subscriber')
const val = require('../val')

const { get$, getType } = require('../../../get')

module.exports = (t, map) => {
  const def = getType(t)
  const path = get$(t)
  const type = def === 1 ? 't' : 's'
  if (path !== true) {
    map = merge(t, path, { val: def }, map)
  } else {
    val(t, map, def)
  }
  iterator(t, map)
  subscriber(map, t, type)
  return map
}
