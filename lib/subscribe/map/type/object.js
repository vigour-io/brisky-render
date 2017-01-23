import merge from '../merge'
import subscriber from '../subscriber'
import iterator from '../iterator'
import { get$ } from '../../../get'

const parse = (subs, arr, path) => {
  if (!arr) { arr = [] }
  if (!path) { path = [] }
  for (let field in subs) {
    if (field === 'val' || typeof subs[field] !== 'object') {
      path.push(subs[field])
      arr.push(path)
    } else {
      parse(subs[field], arr, path.concat(field))
    }
  }
  return arr
}

export default (t, map) => {

  console.warn('go go go object subs', t, map)
  // dificulties
  // - 1 map partial combined with others
  // - 2 multiple subs pointing to same thing
  const subs = get$(t)
  // then use $ as a conitinue in the object
  iterator(t, map)
  const arr = parse(subs)
  console.log(arr, subs)
  for (let i = 0, len = arr.length; i < len; i++) {
    const path = arr[i]
    const type = path.pop()
    // this is a bit messed up later
    const prevmap = merge(t, path, { val: type }, map)
    console.log('hello>?')
    subscriber(prevmap, t, type === true ? 's' : 't')
  }
  return map
}

