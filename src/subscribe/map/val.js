export default (target, map, val) => {
  if (val && map.val !== true) {
    if (
      val === true ||
      (val === 1 && !map.val) ||
      (val === 'switch' && map.val !== true && map.val !== 'shallow') ||
      (val === 'shallow' && map.val !== true)
    ) {
      map.val = val
    }
  }
  return map
}
