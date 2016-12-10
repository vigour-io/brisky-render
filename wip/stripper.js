const fs = require('fs')
const original = fs.readFileSync(__dirname + '/build.js')
const size = val => (encodeURI(val.split(/%..|./).length - 1) / 1024).toFixed(2)

var str = original.toString()
var prev = size(str)
console.log('original', prev, 'kb')
var start = prev

var requires = original.toString().match(/require\(.*?\)/g)
if (requires) {
  console.log(requires.length)
  var obj = {}
  requires.forEach(val => {
    obj[val.match(/require\((.*?)\)/)[1]] = true
  })
  console.log(Object.keys(obj).length)
}
var cnt = 0

// so lets fix this first

for (var i in obj) {
  cnt++
  str = str.split(i).join(cnt)
  str = str.split(i.replace(/'/g, '"')).join(cnt)
}

var calc = size(str)
console.log('strip require names', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

fs.writeFileSync(__dirname + '/build.min.js', str)

const uglifyJS = require('uglify-js')

console.log(__dirname + '/build.min.js')

const file = uglifyJS.minify(__dirname + '/build.min.js', {
  compress: {
    dead_code: true,
    sequences: true,
    properties: true,
    drop_debugger: true,
    unsafe: true,
    unsafe_comps: true,
    conditionals  : true,
    comparisons   : true,
    evaluate      : true,
    booleans      : true,
    loops         : true,
    unused        : true,
    hoist_funs    : true,
    hoist_vars    : false,
    if_return     : true,
    join_vars     : true,
    cascade       : true,
    side_effects  : true,
    global_defs   : {}
  }
})

str = file.code
prev = calc
var calc = size(str)
console.log('strong UglifyJS2', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

prev = calc
str = str.replace(/use strict/g, '')
var calc = size(str)
console.log('remove use strict', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/inherits/g, 'I')
prev = calc
var calc = size(str)
console.log('replace keyMap with N', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/resolveContext/g, 'J')
prev = calc
var calc = size(str)
console.log('replace resolveContext with J', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/contextPath/g, 'K')
prev = calc
var calc = size(str)
console.log('replace contextPath with K', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/parent/g, 'L')
prev = calc
var calc = size(str)
console.log('replace parent with L', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/instances/g, 'M')
prev = calc
var calc = size(str)
console.log('replace instances with M', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/\$transform/g, '$t')
prev = calc
var calc = size(str)
console.log('replace $OPERATOR with $t, $a, $p', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/removeContextKey/g, 'H')
prev = calc
var calc = size(str)
console.log('replace removeContextKey', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/contextProperty/g, 'Q')
prev = calc
var calc = size(str)
console.log('replace contextProperty', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/getDefinition/g, 'R')
prev = calc
var calc = size(str)
console.log('replace getDefinition', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/compute/g, 'U')
prev = calc
var calc = size(str)
console.log('replace compute', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/keys/g, 'X')
prev = calc
var calc = size(str)
console.log('replace keys', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/removeKey/g, 'A')
prev = calc
var calc = size(str)
console.log('replace removeKey', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/addKey/g, 'B')
prev = calc
var calc = size(str)
console.log('replace addKey', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/_cachedNode/g, '_C')
prev = calc
var calc = size(str)
console.log('replace _cachedNode', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/\$map/g, '$M')
prev = calc
var calc = size(str)
console.log('replace $map', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/storeContextKey/g, 'SC')
prev = calc
var calc = size(str)
console.log('replace storeContextKey', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/subscriptionType/g, 'ST')
prev = calc
var calc = size(str)
console.log('replace subscriptionType', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/isStatic/g, 'SS')
prev = calc
var calc = size(str)
console.log('replace isStatic', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/removeContextProperty/g, 'O')
prev = calc
var calc = size(str)
console.log('replace removeContextProperty', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/context/g, 'N')
prev = calc
var calc = size(str)
console.log('replace context', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/Constructor/g, 'C')
prev = calc
var calc = size(str)
console.log('replace Constructor', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

// str = str.replace(/key/g, 'V')
// prev = calc
// var calc = size(str)
// console.log('replace key', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

// str = str.replace(/val/g, 'D')
// prev = calc
// var calc = size(str)
// console.log('replace val', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/helper/g, 'S')
prev = calc
var calc = size(str)
console.log('replace helper', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/exports/g, 'E')
prev = calc
var calc = size(str)
console.log('replace exports', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/property/g, 'F')
prev = calc
var calc = size(str)
console.log('replace property', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/getDefault/g, 'F')
prev = calc
var calc = size(str)
console.log('replace getDefault', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')

str = str.replace(/props/g, 'P')
prev = calc
var calc = size(str)
console.log('replace props', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')


str = str.replace(/Cannot find module|MODULE_NOT_FOUND/g, '')
prev = calc
var calc = size(str)
console.log('replace "Cannot find module, MODULE_NOT_FOUND"', calc, 'kb', '-' + (prev - calc).toFixed(2), 'kb')


console.log('saved', ((1 - calc / start ) * 100).toFixed(), '% ->', size(str), 'kb')

fs.writeFileSync(__dirname +'/build.min.js', str)