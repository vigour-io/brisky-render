import merge from '../merge'
import subscriber from '../subscriber'
import iterator from '../iterator'
import { get$, getType } from '../../../get'
import setVal from '../val'

const parse = (subs, arr, x) => {
  for (let field in subs) {
    let path = x.concat()
    if (field === 'val') {
      path.push(subs[field])
      arr.push(path)
    } else if (typeof subs[field] !== 'object') {
      path.push(field)
      path.push(subs[field])
      arr.push(path)
    } else {
      path.push(field)
      parse(subs[field], arr, path)
    }
  }
  return arr
}

export default (t, map) => {
  const subs = get$(t)
  const arr = parse(subs, [], [])
  let cnt = false
  t.isObject = true
  const def = getType(t)
  for (let i = 0, len = arr.length; i < len; i++) {
    let path = arr[i]
    let type = path.pop()
    let prevmap = path.length === 0
      ? setVal(t, map, type)
      : merge(t, path, { val: type }, map)
    if (!cnt) {
      iterator(t, prevmap || map)
    }
    if (def !== 'switch' || !cnt) {
      subscriber(prevmap || map, t, type === true || type === 'shallow' ? 's' : 't')
    }
    if (!cnt) cnt = true
  }
  if (!cnt) {
    iterator(t, map)
    subscriber(map, t, def)
    setVal(t, map, def)
  }
  return map
}

