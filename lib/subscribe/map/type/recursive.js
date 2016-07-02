'use strict'
// const subscriber = require('../subscriber')

const id = require('../subscriber/context').id

const arr = []
exports.add = function recursive (target, parent, map, prevMap) {
  console.log('RECURSION!', target.path())
  arr.push([ target, parent, map, target.__c, id(target.parent) ])
}

exports.exec = function recursive () {
  // this is not rdy at all

  // all very specic fixes but can definly get trough it later
  for (var i in arr) {
    console.log(i)
    let x = findParentMap(arr[i][1], arr[i][2])
    if (x) {
      let key = findKey(arr[i][2])
      if (!key) {
        if (arr[i][2]._.p._.marker === arr[i][1]) {
          arr[i][2] = arr[i][2]._.p._.key
        }
      }
      if (!arr[i][2][x[0]]) {
        arr[i][2][x[0]] = {}

        // ---------------
        // clean this up
        arr[i][2]._.p._.marker = arr[i][1]
        arr[i][2]._.p._.key = arr[i][2]
        // ---------------

        arr[i][2][x[0]]._ = { recursive: true }
        for (var n in x[1]) {
          if (n !== '_') {
            arr[i][2][x[0]][n] = x[1][n]
          }
        }
        for (var k in x[1]._) {
          if (k !== 'tList') {
            arr[i][2][x[0]]._[k] = x[1]._[k]
          } else {
            arr[i][2][x[0]]._[k] = x[1]._[k].concat([])
          }
        }
      } else {
        console.error('allready got it')
      }
      var found = false
      for (let m = 0, len = x[1]._.tList.length; m < len; m += 4) {
        if (x[1]._.tList[m + 3] === arr[i][3]) {
          console.log('found in tlist')
          arr[i][2][x[0]]._.tList[m + 1] = arr[i][4]
          found = true
          break
        }
      }
      if (!found) {
        console.error('cannot find parent in tlist')
      }
      arr[i][2][x[0]]._.p = arr[i][2]
    } else {
      console.error('cannot findParentMap')
    }
  }
}

function findParentMap (parent, map) {
  map = map = '_' in map && map._.p
  while (map) {
    for (let key in map._.t) {
      if (map._.t[key] === parent || map._.t[key] instanceof parent._Constructor) {
        return [ parseParent(parent), map ]
      }
    }
    map = '_' in map && map._.p
  }
}

function parseParent (parent) {
  // not rdy at all ofc

  // one up from $any
  return parent.$[parent.$.length - 2]
}

function findKey (map) {
  var p = map._ && map._.p
  if (p) {
    for (var k in p) {
      // this is not correct
      if (p[k] === map) {
        return k
      }
    }
  }
}
