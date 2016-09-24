'use strict'
module.exports = (target, map, val) => {
  console.warn('yo yo', target.path())

  if (val && map.val !== true) {
    map.val = val
  }

  // if (target.sync === false) {
  //   console.warn('noSync...', target.path())
  //   // need to create a list in _ i geuss
  //   if ((val === true && map.val !== val) || !map.val) {
  //     console.error(val, map.val, map)
  //     if (!map._.sync) {
  //       map._.sync = {}
  //     }
  //     map._.sync.val = map.val
  //     console.info(map._.sync)
  //   }
  // } else if (target.sync === false) {
  //   console.log('ok normal', target.path())
  //   if (map.val) {
  //     console.log(map.val)
  //   }
  //   if (map._.sync) {
  //     console.error('got sync', map, map.val, val, target.path())
  //   }
  // }
}
