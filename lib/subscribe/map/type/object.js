// const merge = require('../merge')
// const iterator = require('../iterator')
// const subscriber = require('../subscriber')
// const { get$ } = require('../../../get')

// module.exports = function object (target, map) {
//   // dificulties
//   // - 1 map partial combined with others
//   // - 2 multiple subs pointing to same thing
//   const subs = target.$
//   iterator(target, map)
//   const arr = parseit(subs)
//   for (let i = 0, len = arr.length; i < len; i++) {
//     const path = arr[i]
//     const type = path.pop()
//     // this is a bit messed up later
//     const prevmap = merge(target, path, { val: type }, map)
//     subscriber(prevmap, target, type === true ? 's' : 't')
//   }
//   return map
// }

// function parseit (subs, arr, path) {
//   if (!arr) { arr = [] }
//   if (!path) { path = [] }
//   for (let field in subs) {
//     if (field === 'val') {
//       path.push(subs[field])
//       arr.push(path)
//     } else {
//       parseit(subs[field], arr, path.concat(field))
//     }
//   }
//   return arr
// }
