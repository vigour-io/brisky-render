'use strict'
const merge = require('../merge')

const arr = []
exports.add = function recursive (target, parent, map, prevMap) {
  console.log('push!')
  arr.push([ target, parent, map, prevMap ])
}

exports.exec = function recursive (target, parent, map, prevMap) {
  console.log('EXEC')
  for (var i in arr) {
    console.log('???',  arr[i])
    findParentMap(arr[i][1], arr[i][2])
  }
}

function findParentMap (parent, map) {
  // for this to work the top map has to be complete before coming here
  while (map) {
    // if(map)
    console.info(map)
    map = '_' in map && map._.p
  }
  // pass map to find it and return
}
