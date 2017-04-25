import merge from '../merge'
import iterator from '../iterator'
import subscriber from '../subscriber'
import setVal from '../val'
import { get$, getType, getForce } from '../../../get'

export default (t, map) => {
  const def = getType(t)
  const path = get$(t)
  const force = getForce(t)
  const type = def === 'switch' ? 't' : 's'
  if (path !== true) {
    map = merge(t, path, { val: def }, map)
  } else {
    setVal(t, map, def)
  }
  iterator(t, map)
  subscriber(map, t, force || type)
  return map
}
