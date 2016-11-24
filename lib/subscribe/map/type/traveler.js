const subscriber = require('../subscriber')
const { isGroup } = require('../get')

module.exports = (t, map, prev) => {
  if (!isGroup(t)) {
    // maybe not for properties in general
    subscriber(map, t, 't')
  } else {
    // if context key
    // if (target.storeContextKey) {
    subscriber(map, t, 't')
    // }
  }
  return map
}
