import setVal from './val'

export default function set (target, val, map, path) {
  const len = path.length - 1
  if (len === 0) {
    map[path[0]] = val
    val._ = { p: map }
    if (val.val) {
      const subsVal = val.val
      delete val.val
      setVal(target, val, subsVal)
    }
  } else {
    let m = map
    for (let i = 0, key; i < len; i++) {
      key = path[i]
      if (!m[key]) {
        m[key] = { _: { p: m }, $blockRemove: false } // $blockRemove: false - should not be nessecary
      }
      m = m[key]
    }
    m[path[len]] = val
    val._ = { p: m }
    if (val.val) {
      const subsVal = val.val
      delete val.val
      setVal(target, val, subsVal)
    }
  }
  return val
}
