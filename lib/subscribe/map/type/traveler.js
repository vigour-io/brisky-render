import subscriber from '../subscriber'

export default (t, map, prev) => {
  subscriber(map, t, 't')
  return map
}
