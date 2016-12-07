const subscriber = require('../subscriber')

module.exports = (t, map, prev) => {
  subscriber(map, t, 't')
  return map
}
