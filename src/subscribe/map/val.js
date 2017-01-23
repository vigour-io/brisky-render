export default (target, map, val) => {
  // if (target.sync === false) {
  //   if ((val === true && map.val !== val) || !map.val) {
  //     map._.sync = map.val || true
  //   }
  // } else if (map._.sync) {
  //   if (val === 1 && map._.sync === true) {
  //     map._.sync = 1
  //   } else {
  //     delete map._.sync
  //   }
  // }

  // console.log('set val', val)

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
  // return map
}
