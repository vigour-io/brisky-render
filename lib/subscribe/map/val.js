'use strict'
module.exports = (target, map, val) => {
  // console.warn('yo yo', target.path())
  // also not so nice
 // just every where where vla is being set handle it good
 // then the end result cvan just be cleaned or somethinfg
  if (target.sync === false) {
    // console.warn('noSync...', target.path())
    // need to create a list in _ i geuss
    if ((val === true && map.val !== val) || !map.val) {
      // console.error(val, map.val, map)
      if (!map._.sync) {
        map._.sync = {}
      }

      console.error('fuck is sync!', map.val, target.path())

      map._.sync.val = map.val
      // console.info(map._.sync)
    }
  } else if (target.sync === false) {
    // console.log('ok normal', target.path())
    if (map.val) {
      console.log('old map', map.val)
    }
    if (map._.sync) {
      // means do something...
      console.error('got sync need to resolve', map, map.val, val, target.path())
    }
  }
  if (val && map.val !== true) {
    map.val = val
  }
}