(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var d = Date.now()

var struct = require('brisky-struct')
var render = require('brisky-render')
var stats = require('./stats')

var state = struct({ collection: [ 1, 2 ] })

var app = render({
  collection: {
    $: 'collection.$any',
    props: {
      default: {
        style: {
          border: 'rgb(84, 206, 177)',
          margin: '5px',
          background: 'rgb(38, 50, 56)',
          color: 'rgb(128, 203, 196)',
          fontFamily: 'courier',
          textAlign: 'center',
          padding: '10px'
        },
        text: { $: true },
        field: { text: 'static text' },
        other: { text: 'other field' },
        field2: { text: 'static text' },
        field3: { text: 'static text' }
      }
    }
  }
}, state)

stats(state)

module.exports = app

if (document.body) {
  console.log('re-render')
  var pr = document.getElementById('prerender')
  if (pr) {
    document.body.removeChild(pr)
  }
  document.body.appendChild(app)
  console.log('CREATE TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  d = Date.now()
  state.collection[state.collection.keys().length - 1].set('hello')
  console.log('UPDATE ONE:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  d = Date.now()
  state.collection.set(state.collection.map(function (p) { return p.compute() + '!'; }))
  console.log('UPDATE ALL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
}

},{"./stats":84,"brisky-render":47,"brisky-struct":55}],2:[function(require,module,exports){
var struct = require('brisky-struct')

var element = struct({
  type: 'element',
  types: {
    property: require('./property')
  },
  instances: false,
  define: { isElement: true }, // unnesecary code
  props: {
    tag: true,
    default: 'self'
  },
  tag: 'div',
  inject: [
    require('./subscribe'),
    require('./findindex'),
    require('./render/dom/element'),
    require('./property/text'),
    require('./property/html'),
    require('./property/group'),
    require('./property/attr'),
    require('./property/class'),
    require('./property/style'),
    require('./widget'),
    require('./events')
  ]
}, false)

element.set({ types: { element: element } }, false)

module.exports = element

},{"./events":5,"./findindex":8,"./property":14,"./property/attr":10,"./property/class":11,"./property/group":12,"./property/html":13,"./property/style":15,"./property/text":20,"./render/dom/element":25,"./subscribe":32,"./widget":45,"brisky-struct":55}],3:[function(require,module,exports){
module.exports = exports = function attach (e, data) {
  var touch = e.changedTouches
  var ev = touch ? touch[0] : e
  if (data.x !== void 0) {
    data.prevX = data.x
  }
  if (data.y !== void 0) {
    data.prevY = data.y
  }
  if (ev.clientX !== void 0) {
    data.x = ev.clientX
  }
  if (ev.clientY !== void 0) {
    data.y = ev.clientY
  }
  data.event = e
  return data
}

exports.start = function attachStartPos (data) {
  data.startX = data.x
  data.startY = data.y
  return data
}

},{}],4:[function(require,module,exports){
var attach = require('./attach')
var bstamp = require('brisky-stamp')
var restore = require('./restore')

var emitter = function (t, key) { return t.emitters && t.emitters[key] ||
  t.inherits && emitter(t.inherits, key); }

module.exports = function (key, e) {
  var t = e.target
  var stamp
  do {
    var elem = t._
    if (elem) {
      var listener = emitter(elem, key)
      if (listener) {
        if (!stamp) {
          stamp = bstamp.create(key)
        }
        var data = { target: t }
        restore(data)
        elem.emit(key, attach(e, data), stamp)
        if (data.prevent) {
          break
        }
      }
    }
    if (stamp) {
      bstamp.close(stamp)
    }
  } while ((t = t.parentNode))
}

},{"./attach":3,"./restore":7,"brisky-stamp":48}],5:[function(require,module,exports){
var emitterProperty = require('brisky-struct/lib/struct').props.on.struct.props.default
// make everything avaible on the top
var parent = require('../render/dom/parent')

var delegate = require('./delegate')

var listen = require('./listener')

 // addListener(key, (e) => delegate(key, e))

// check if event allrdy there
// delegate (+context)
// subscribe

// const register = () => {

// }

var cache = {}

exports.on = {
  props: {
    error: {},
    remove: {},
    default: function (t, val, key) {
      if (!cache[key]) {
        cache[key] = true
        listen(key, function (e) { return delegate(key, e); })
      }
      t._p.set({ hasEvents: true }, false)
      emitterProperty(t, val, key)
    }
  }
}

// 'use strict'
// const getParent = require('brisky-core/lib/render/dom/parent')

exports.props = {
  hasEvents: {
    // make a flag when subscribed or something
    type: 'property',
    // sync: false,
    // just do sync nicely and not like smelly ballz
    // subscriptionType: 1, // make it spoecial -- need non-deep variant for this
    $: true,
    render: {
      state: function state (target, s, type, subs, tree, id, pid) {
        var node = parent(tree, pid)
        if (node) {
          if (s) {
            node._sc = s.storeContext()
            node._s = s
          }
          if (!('_' in node)) {
            node._ = target.parent()
          }
        }
      }
    }
  }
}

},{"../render/dom/parent":26,"./delegate":4,"./listener":6,"brisky-struct/lib/struct":66}],6:[function(require,module,exports){
(function (global){
var ua = require('vigour-ua/navigator') // again scope it differently this is bit dirty

// just use hasTouch
var touch = typeof window !== 'undefined' && ((('ontouchstart' in global) ||
  global.DocumentTouch &&
  document instanceof global.DocumentTouch) ||
  navigator.msMaxTouchPoints)

// super unreliable check for chrome emulator for development (on mac only)
// const isChromeEmulator = touch &&
//   navigator.vendor === 'Google Inc.' &&
//   navigator.platform === 'MacIntel'

if (ua.platform === 'ios' && touch) {
  document.documentElement.style.cursor = 'pointer' // ios test...
  document.body.style.cursor = 'pointer'
}

module.exports = function () {
  var arguments$1 = arguments;

  var l = arguments.length
  var a = []
  for (var i = 0; i < l; i++) {
    var key = arguments$1[i]
    var listener = arguments$1[++i]
    addEventListener(key, listener, key === 'focus' || key === 'scroll' || key === 'blur')
    a.push(key, listener)
  }
  return function () {
    for (var i = 0; i < l; i++) { // remove listeners test!
      document.removeEventListener(a[i], a[++i])
    }
  }
}

var addEventListener = function addEventListener (key, listener, capture) {
  document.addEventListener(key, listener, capture)
}
// : function addEventListener (key, listener, capture) { // chrome emulator tests
//   const touchEvent = key.indexOf('mouse') === -1
//   if (touchEvent) { document.addEventListener(key, listener, capture) }
// }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"vigour-ua/navigator":83}],7:[function(require,module,exports){
module.exports = function (data) {
  var target = data.target
  var state = target._s
  if (state) {
    var resolved = state.applyContext(target._sc)
    if (resolved) {
      target._s = state = resolved
      target._sc = state.storeContext()
    } else if (resolved === null) {
      target._s = null
      delete target._sc
      state = null
    }
    data.state = state
  }
}

},{}],8:[function(require,module,exports){
var ref = require('./get');
var get$any = ref.get$any;
var ref$1 = require('./get');
var tag = ref$1.tag;
var ref$2 = require('brisky-struct/lib/get');
var get = ref$2.get;

exports.define = {
  findIndex: function findIndex (parent) {
    if (parent) {
      if (this.indexProperty) {
        return this.indexProperty.findIndex(parent)
      } else {
        if (!get$any(parent)) {
          var key = get(this, 'key')
          if (key !== void 0 && key !== null) {
            var keys = parent.keys()
            if (keys) {
              var len = keys.length
              if (len > 1) {
                for (var i = 0; i < len; i++) {
                  if (keys[i] === key) {
                    if (tag(parent) === 'fragment') {
                      return (parent.findIndex(parent.parent()) || 1) + ((i + 1) / (len + 1)).toFixed(len + ''.length)
                    } else {
                      return i + 1
                    }
                  }
                }
              }
            }
          }
        }
        if (tag(parent) === 'fragment') {
          return parent.findIndex(parent.parent())
        }
      }
    }
  }
}

},{"./get":9,"brisky-struct/lib/get":54}],9:[function(require,module,exports){
var getPath = function (t, path) {
  var i = 0
  var len = path.length
  while (i < len && (t = t[path[i++]]));
  return t
}

var isWidget = function (t) { return t.isWidget !== void 0 ? t.isWidget : t.inherits && isWidget(t.inherits); }

var cache = function (t) { return t._cachedNode !== void 0
  ? t._cachedNode
  : t.inherits && cache(t.inherits); }

var tag = function (t) { return t.tag || t.inherits && tag(t.inherits); }

var get$ = function (t) { return t.$ !== void 0 ? t.$ : t.inherits && get$(t.inherits); }

var get$any = function (t) { return t.$any !== void 0 ? t.$any : t.inherits && get$any(t.inherits); }

var get$switch = function (t) { return t.$switch !== void 0 ? t.$switch : t.inherits && get$switch(t.inherits); }

var getType = function (t) { return t.subscriptionType || t.inherits && getType(t.inherits); }

exports.get$ = get$
exports.get$any = get$any
exports.get$switch = get$switch
exports.getType = getType

exports.tag = tag
exports.cache = cache
exports.getPath = getPath

exports.isWidget = isWidget

},{}],10:[function(require,module,exports){
var parent = require('../render/dom/parent')
var ref = require('../render/static');
var property = ref.property;

exports.props = {
  attr: {
    type: 'property',
    render: {
      static: property,
      state: function state (t, state, type, subs, tree, id, pid) {
        var pnode = parent(tree, pid)
        if (pnode && !pnode._propsStaticParsed) {
          property(t, pnode)
          pnode._propsStaticParsed = true
        }
      }
    },
    props: {
      type: null,
      default: {
        props: { name: true },
        render: {
          static: function static$1 (t, pnode) {
            var val = t.compute()
            if (val === t || val === void 0) {
              pnode.removeAttribute(t.name || t.key)
            } else {
              pnode.setAttribute(t.name || t.key, val)
            }
          },
          state: function state$1 (t, state, type, subs, tree, id, pid) {
            var pnode = parent(tree, pid)
            var key = t.name || t.key
            if (type === 'remove') {
              if (pnode) {
                pnode.removeAttribute(key)
              }
            } else {
              var val = t.compute(state)
              var type$1 = typeof val
              if (type$1 === 'boolean') { val = val + '' }
              if ((type$1 === 'object' && val.inherits) || val === void 0) {
                if (pnode.getAttribute(key)) {
                  pnode.removeAttribute(key) // missing
                }
              } else {
                if (pnode.getAttribute(key) != val) { // eslint-disable-line
                  pnode.setAttribute(key, val)
                }
              }
            }
          }
        }
      },
      value: {
        render: {
          static: function static$2 (t, pnode) {
            var val = t.compute() // missing
            pnode.value = val // missing
          },
          state: function state$2 (t, state, type, subs, tree, id, pid) {
            var pnode = parent(tree, pid)
            if (type === 'remove') {
              if (pnode) { pnode.value = '' } // missing
            } else {
              var val = t.compute(state)
              if (val !== pnode.value) {
                pnode.value = val === t ? '' : val
              }
            }
          }
        }
      }
    }
  }
}

},{"../render/dom/parent":26,"../render/static":31}],11:[function(require,module,exports){
var parent = require('../render/dom/parent')
var ref = require('../get');
var get$ = ref.get$;
var ref$1 = require('brisky-struct/lib/get');
var get = ref$1.get;

exports.props = {
  class: {
    type: 'group',
    storeContextKey: true,
    subscriptionType: true,
    props: { useKey: true },
    render: {
      static: function static$1 (t, node, store) {
        var val = t.compute()
        if (val === true || get(t, 'useKey')) {
          var key = get(t.parent(), 'key')
          val = typeof val === 'string' ? (val + ' ' + key) : key
        } else if (typeof val === 'object') {
          val = ''
        }
        var keys = t.keys()
        setClassName(keys && keys.length ? parseStore(val, store) : val, node)
      },
      state: function state (t, s, type, subs, tree, id, pid, store) {
        var node = parent(tree, pid)
        if (node) {
          var val = s && get$(t) ? t.compute(s, s) : t.compute()
          if (val === true || get(t, 'useKey')) {
            var key = parseKey(t, id)
            val = typeof val === 'string' ? (val + ' ' + key) : key
          } else if (typeof val === 'object') {
            val = ''
          }
          var keys = t.keys()
          setClassName(keys && t.keys().length ? parseStore(val, store) : val, node)
        }
      }
    }
  }
}

var parseStore = function (val, store) {
  for (var key in store) {
    var fieldval = store[key]
    if (fieldval === true) {
      fieldval = key
    }
    if (fieldval !== false) {
      if (val) {
        val += ' ' + fieldval
      } else {
        val = fieldval
      }
    }
  }
  return val
}

var setClassName = function (val, node) {
  if (val) {
    node.className = val
  } else if ('className' in node) {
    node.removeAttribute('class')
  }
}

var parseKey = function (t, pid) {
  if (pid[0] === 'c') {
    for (var i = pid.length - 1; i >= 0; i--) {
      if (pid[i] === '-') {
        return pid.slice(1, i)
      }
    }
  } else {
    return get(t.parent(), 'key')
  }
}

},{"../get":9,"../render/dom/parent":26,"brisky-struct/lib/get":54}],12:[function(require,module,exports){
var ref = require('../render/static');
var property = ref.property;
var parent = require('../render/dom/parent')
var bstamp = require('brisky-stamp')
var ref$1 = require('../get');
var get$ = ref$1.get$;

exports.types = {
  group: {
    type: 'property',
    subscriptionType: 1,
    define: {
      render: {
        static: function static$1 (t, pnode) {
          var store = {}
          var parsed = '_' + t.key + 'StaticParsed'
          if (pnode) {
            property(t, pnode, store)
            pnode[parsed] = true
          }
          t.groupRender.static(t, pnode, store)
        },
        state: function state (t, s, type, subs, tree, id, pid, order, store) {
          var storeId = pid + t.key
          if (!store) { store = tree._[storeId] || (tree._[storeId] = {}) }
          var pnode = parent(tree, pid)
          if (pnode) {
            var parsed = '_' + t.key + 'StaticParsed'
            if (!pnode[parsed]) {
              property(t, pnode, store)
              pnode[parsed] = true
            }
            if (!store.inProgress) {
              store.inProgress = true
              bstamp.on(function () {
                delete store.inProgress
                t.groupRender.state(t, s, type, subs, tree, id, pid, store)
              })
            }
          }
        }
      }
    },
    props: {
      render: function render (t, val) {
        t.set({ define: { groupRender: val } })
      },
      default: {
        define: {
          getStore: function getStore (tree, id) {
            var $ = get$(this)
            if ($) {
              var length = $.length
              // why any lets make a test for this!
              if (this.$any) {
                console.log('ANY')
                length--
              }
              while (length) {
                length--
                tree = tree._p
              }
            }
            var _ = tree._ || (tree._ = {})
            var store = _[id] || (_[id] = {})
            return store
          }
        },
        render: {
          static: function static$2 (t, node, store) {
            store[t.key] = t.compute()
          },
          state: function state$1 (t, s, type, subs, tree, id, pid, order) {
            var p = t._p
            var key = p.key
            var store = t.getStore(tree, pid + key)
            if (!s || s.val === null || type === 'remove') {
              if (t.key in store) {
                delete store[t.key]
              }
            } else {
              store[t.key] = t.compute(s, s)
            }
            p.render.state(p, s, type, subs, tree, id, pid, order, store)
          }
        }
      }
    }
  }
}

},{"../get":9,"../render/dom/parent":26,"../render/static":31,"brisky-stamp":48}],13:[function(require,module,exports){
var parent = require('../render/dom/parent')

exports.props = {
  html: {
    type: 'property',
    render: {
      static: function static$1 (t, node) {
        node.innerHTML = t.compute()
      },
      state: function state  (t, s, type, subs, tree, id, pid) {
        var node = parent(tree, pid)
        if (type === 'remove') {
          if (node) {
            var nodes = node.childNodes
            var i = nodes.length
            while (i--) {
              node.removeChild(nodes[i])
            }
          }
        } else {
          var val = t.compute(s, s)
          if (val === void 0 || typeof val === 'object') {
            var nodes$1 = node.childNodes
            var i$1 = nodes$1.length
            while (i$1--) {
              node.removeChild(nodes$1[i$1])
            }
          } else {
            node.innerHTML = val
          }
        }
      }
    }
  }
}

},{"../render/dom/parent":26}],14:[function(require,module,exports){
var struct = require('brisky-struct')

module.exports = struct({
  type: 'property',
  inject: [
    require('../findindex'),
    require('../subscribe')
  ],
  instances: false,
  props: {
    storeContextKey: true,
    default: 'self'
  },
  on: {
    data: function (val, stamp, t) {
      if (t._p && t._p._cachedNode === void 0) {
        t._p._cachedNode = null
      }
    }
  },
  subscriptionType: true
  // noReference: true,
}, false)

},{"../findindex":8,"../subscribe":32,"brisky-struct":55}],15:[function(require,module,exports){
var parent = require('../../render/dom/parent')
var ref = require('../../render/static');
var property = ref.property;

// not good enough -- need to parse it (for server side)
var ua = require('vigour-ua/navigator')

exports.types = {
  style: require('./type')
}

exports.props = {
  style: {
    type: 'property',
    render: {
      static: function static$1 (t, pnode) {
        property(t, pnode)
      },
      state: function state (t, s, type, subs, tree, id, pid) {
        if (type !== 'remove') {
          var pnode = parent(tree, pid)
          if (!pnode._styleStaticParsed) {
            property(t, pnode)
            pnode._styleStaticParsed = true
          }
        }
      }
    },
    inject: [
      require('./px'),
      require('./transform')
    ],
    props: {
      default: { type: 'style' },
      order: {
        // put ua info on top for server or from render for example
        // or add both for now
        name: ua.browser === 'ie' && ua.version === 10 ? 'msFlexOrder' : 'order'
      }
    }
  }
}

},{"../../render/dom/parent":26,"../../render/static":31,"./px":16,"./transform":17,"./type":18,"vigour-ua/navigator":83}],16:[function(require,module,exports){
var parent = require('../../render/dom/parent')
var unit = require('./util').appendUnit
var pxval = { type: 'px' }
var props = {}
var pxprops = [
  'minWidth',
  'width',
  'height',
  'left',
  'right',
  'bottom',
  'top',
  'margin',
  'padding'
]

for (var i = 0; i < pxprops.length; i++) {
  props[pxprops[i]] = pxval
}

exports.types = {
  px: {
    type: 'style',
    render: {
      static: function static$1 (target, pnode) {
        pnode.style[target.key] = unit(target.compute(), 'px')
      },
      state: function state (target, s, type, subs, tree, id, pid) {
        if (type !== 'remove') { // fix
          var pnode = parent(tree, pid)
          pnode.style[target.key] = unit(
            s ? target.compute(s, s) : target.compute(), 'px'
          )
        }
      }
    }
  }
}

exports.props = props

},{"../../render/dom/parent":26,"./util":19}],17:[function(require,module,exports){
var parent = require('../../render/dom/parent')
var prefix = require('vigour-ua/navigator').prefix
var transform = prefix ? prefix + 'Transform' : 'transform'
var unit = require('./util').appendUnit
var ref = require('../../get');
var get$ = ref.get$;

exports.props = {
  transform: {
    type: 'group',
    render: {
      static: function static$1 (t, node, store) {
        var val = t.compute()
        if (!val || typeof val !== 'string') { val = '' }
        setTransform(val, store, node)
      },
      state: function state (t, s, type, subs, tree, id, pid, store) {
        var val = s && get$(t) ? t.compute(s, s) : t.compute()
        if (!val || typeof val !== 'string') { val = '' }
        var node = parent(tree, pid)
        if (node) { setTransform(val, store, node) }
      }
    }
  }
}

function setTransform (val, store, node) {
  if ('x' in store || 'y' in store) {
    var translate3d = "translate3d(" + ((store.x
      ? unit(store.x, 'px')
      : '0px')) + ", " + ((store.y
        ? unit(store.y, 'px')
        : '0px')) + ", 0px)"
    val = val ? (val + ' ' + translate3d) : translate3d
  }

  if ('scale' in store) {
    var scale = "scale(" + (store.scale) + ")"
    val = val ? (val + ' ' + scale) : scale
  }

  if ('rotate' in store) {
    var rotate = "rotate(" + (store.rotate) + "deg)"
    val = val ? (val + ' ' + rotate) : rotate
  }

  node.style[transform] = val
}

},{"../../get":9,"../../render/dom/parent":26,"./util":19,"vigour-ua/navigator":83}],18:[function(require,module,exports){
var parent = require('../../render/dom/parent')
exports.properties = { name: true }

exports.type = 'property'

exports.render = {
  static: function static$1 (target, pnode) {
    pnode.style[target.name || target.key] = target.compute()
  },
  state: function state (target, s, type, subs, tree, id, pid) {
    if (type !== 'remove') {
      var pnode = parent(tree, pid)
      pnode.style[target.name || target.key] = s
      ? target.compute(s, s)
      : target.compute()
    }
  }
}

},{"../../render/dom/parent":26}],19:[function(require,module,exports){
exports.appendUnit = function (val, unit) { return typeof val === 'number' && !isNaN(val)
  ? val + unit
  : val; }

},{}],20:[function(require,module,exports){
'use strict'
var parent = require('../render/dom/parent')
var append = require('../render/dom/create/append')
var appendStatic = append.static
var appendState = append.state

exports.types = {
  text: {
    class: null,
    subscriptionType: true,
    render: {
      static: function static$1 (t, pnode) {
        appendStatic(t, pnode, document.createTextNode(t.compute()))
      },
      state: function state  (t, s, type, subs, tree, id, pid, order) {
        var val = t.compute(s, s)
        var node = tree._[id]
        var pnode
        if (!node) {
          if (typeof val !== 'object' && val !== void 0) {
            pnode = parent(tree, pid)
            node = tree._[id] = document.createTextNode(val)
            appendState(t, pnode, node, subs, tree, id, order)
          }
        } else {
          // remove is overhead here (extra compute)
          if (type && type === 'remove' || typeof val === 'object' || val === void 0) {
            pnode = parent(tree, pid) || node.parentNode
            if (pnode) { pnode.removeChild(node) }
          } else {
            if (val && typeof val !== 'object' || val === 0) {
              node.nodeValue = val
            }
          }
        }
      }
    }
  }
}

exports.props = { text: { type: 'text' } }

},{"../render/dom/create/append":21,"../render/dom/parent":26}],21:[function(require,module,exports){
var ref = require('../../fragment');
var findParent = ref.findParent;
var isFragment = ref.isFragment;

exports.static = function (t, pnode, domNode) {
  if (isFragment(pnode)) {
    pnode.push(domNode)
    pnode = findParent(pnode)
  }
  var index = t.findIndex(t.parent())
  if (index !== void 0) {
    pnode._last = index
    domNode._order = index
  }
  pnode.appendChild(domNode)
}

exports.state = function (t, pnode, node, subs, tree, uid, order) {
  var fragment
  if (isFragment(pnode)) {
    fragment = pnode
    pnode = findParent(pnode)
  }
  if (order !== void 0) {
    var next = findNode(order, pnode)
    node._order = order
    if (next) {
      if (fragment) { fragment.push(node) }
      pnode.insertBefore(node, next)
    } else {
      pnode._last = order
      if (fragment) { fragment.push(node) }
      pnode.appendChild(node)
    }
  } else {
    if (fragment) { fragment.push(node) }
    pnode.appendChild(node)
  }
}

function findNode (order, pnode) {
  var last = pnode._last
  if (order < last) {
    for (var c = pnode.childNodes, len = c.length, i = 0; i < len; i++) {
      if (c[i] && c[i]._order > order) {
        if (i < 2 || (c[i - 1] && (c[i - 1]._order < order || !c[i - 1]._order))) {
          return c[i]
        }
      }
    }
  }
}

},{"../../fragment":27}],22:[function(require,module,exports){
var render = require('./render')
var renderStatic = render.static
var renderState = render.state
var parent = require('../parent')
var append = require('./append')
var appendStatic = append.static
var appendState = append.state
var isFragment = require('../../fragment').isFragment
var ref = require('../../../get');
var tag = ref.tag;

exports.static = function (t, pnode) {
  var node = renderStatic(t)
  appendStatic(t, pnode, node)
  if (t.hasEvents) { node._ = t }
  return node
}

exports.state = function (t, state, type, subs, tree, id, pid, order) {
  var pnode = parent(tree, pid)
  var node = renderState(t, type, subs, tree, id, pnode)
  if (pnode) {
    if (tag(t) !== 'fragment') {
      appendState(t, pnode, node, subs, tree, id, order)
    } else {
      if (isFragment(pnode)) {
        pnode.push(node)
      }
    }
  }
  return node
}

},{"../../../get":9,"../../fragment":27,"../parent":26,"./append":21,"./render":23}],23:[function(require,module,exports){
var ref = require('brisky-struct/lib/get');
var get = ref.get;
var fragment = require('./fragment')
var ref$1 = require('../../../static');
var property = ref$1.property;
var element = ref$1.element;
var isStatic = ref$1.isStatic;
var staticProps = ref$1.staticProps;
var ref$2 = require('../../../../get');
var cache = ref$2.cache;
var tag = ref$2.tag;

var hasStateProperties = function (t) {
  var keys = t.keys()
  if (keys) {
    var i = keys.length
    while (i--) {
      var check = get(t, keys[i])
      if (!check.isElement && !isStatic(check)) {
        return true
      }
    }
  }
}

exports.static = function (t) {
  var cached = cache(t)
  var node
  if (cached && isStatic(t)) {
    node = cached.cloneNode(true)
    if (cached._index) {
      node._index = cached._index
    }
    if (cached._last) {
      node._last = cached._last
    }
  } else {
    if (cached) {
      node = cached.cloneNode(false)
      // need to get
      if (cached._propsStaticParsed) {
        node._propsStaticParsed = true
      }
    } else {
      var nodeType = tag(t)
      if (nodeType === 'fragment') {
        console.error('not handeling static fragments yet')
      } else {
        node = document.createElement(nodeType)
        property(t, node)
        t._cachedNode = node
      }
    }
    element(t, node)
  }
  return node
}

exports.state = function (t, type, subs, tree, id, pnode) {
  var cached = cache(t)
  var node
  // @todo: this copies unwanted styles / props -- need to add an extra clonenode for this
  if (cached) {
    node = cached.cloneNode(false)
    tree._[id] = node
    if (cached._last) {
      node._last = cached._last
    }
    if (cached._index) {
      node._index = cached._index
    }
  } else {
    var nodeType = tag(t)
    if (nodeType === 'fragment') {
      return fragment(t, pnode, id, tree)
    } else {
      node = document.createElement(nodeType)
      var hasStaticProps = staticProps(t).length
      if (hasStaticProps) {
        t._cachedNode = node
        property(t, node)
        if (hasStateProperties(t)) {
          node = t._cachedNode.cloneNode(false)
        }
      }
    }
    tree._[id] = node
  }
  element(t, node)
  return node
}

// module.exports = require('./index')

},{"../../../../get":9,"../../../static":31,"./fragment":24,"brisky-struct/lib/get":54}],24:[function(require,module,exports){
var parseStatic = require('../../../static')
var elems = parseStatic.element

module.exports = function (target, pnode, id, tree) {
  var arr = [ pnode ]
  elems(target, arr)
  tree._[id] = arr
  return arr
}

},{"../../../static":31}],25:[function(require,module,exports){
var ref = require('./create');
var createState = ref.state;
var createStatic = ref.static;
var ref$1 = require('../fragment');
var findParent = ref$1.findParent;
var isFragment = ref$1.isFragment;
var ref$2 = require('../../get');
var tag = ref$2.tag;
var parent = require('./parent')

// check for null as well -- move this to get
var getRemove = function (t) { return t.remove || t.inherits && getRemove(t.inherits); }

var hasRemove = function (t) { return t.emitters && getRemove(t.emitters) ||
  t.inherits && hasRemove(t.inherits); }

var removeFragmentChild = function (node, pnode) {
  for (var i = 1, len = node.length; i < len; i++) {
    if (isFragment(node[i])) {
      removeFragmentChild(node[i], pnode)
    } else {
      pnode.removeChild(node[i])
    }
  }
}

exports.props = {
  staticIndex: true,
  _cachedNode: true
}

exports.render = {
  static: createStatic,
  state: function state (t, s, type, subs, tree, id, pid, order) {
    var node = tree._ && tree._[id]
    var pnode
    if (type === 'remove') {
      if (node) {
        pnode = parent(tree, pid)
        if (pnode) {
          if (tag(t) === 'fragment') {
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            removeFragmentChild(node, pnode)
          } else if (!hasRemove(t)) {
            if (isFragment(pnode)) {
              // add tests for this
              for (var i = 0, len = pnode.length; i < len; i++) {
                if (pnode[i] === node) {
                  pnode.splice(i, 1)
                  break
                }
              }
              pnode = pnode[0]
            }
            if (isFragment(pnode)) {
              pnode = findParent(pnode)
            }
            pnode.removeChild(node)
          }
        }
        delete tree._[id]
      }
    } else if (!node) {
      node = createState(t, s, type, subs, tree, id, pid, order)
    }
    return node
  }
}

},{"../../get":9,"../fragment":27,"./create":22,"./parent":26}],26:[function(require,module,exports){
var parent = function (tree, pid) { return tree._ && tree._[pid] ||
  tree._p && parent(tree._p, pid); }

module.exports = parent

},{}],27:[function(require,module,exports){
exports.findParent = function (pnode) {
  while (isFragment(pnode)) {
    pnode = pnode[0]
  }
  return pnode
}

exports.isFragment = isFragment

function isFragment (node) {
  return node instanceof Array
}

},{}],28:[function(require,module,exports){
var struct = require('brisky-struct')
var subscribe = require('brisky-struct/lib/subscribe').subscribe
var render = require('./render')
var element = require('../element')
var ref = require('../get');
var getPath = ref.getPath;
var get$ = ref.get$;
var get$any = ref.get$any;
var bstamp = require('brisky-stamp')

module.exports = function (elem, state, cb) {
  if (!elem.inherits) {
    elem = element.create(elem)
  }
  var subs = elem.$map()
  var tree = {}
  var stamp = bstamp.create('render')
  if (state === void 0) {
    render(state, 'new', subs, tree)
    if (cb) { cb(subs, tree, elem) }
  } else {
    if (!state || !state.inherits) { state = struct(state) }
    render(state, 'new', subs, tree)
    if (cb) {
      subscribe(state, subs, function (s, type, su, t) {
        render(s, type, su, t)
        cb(subs, tree, elem, s, type, su, t)
      }, tree)
      cb(subs, tree, elem)
    } else {
      subscribe(state, subs, render, tree)
    }
  }
  bstamp.close(stamp)
  var uid = elem.uid()

  var $ = get$(elem)

  if ($) {
    var t
    var path = $
    if (get$any(elem)) {
      if (elem.$.length === 1) {
        path = []
        t = tree
      } else {
        path = $.slice(0, -1)
        t = tree
        t = getPath(tree, path)
      }
    } else {
      t = getPath(tree, $)
    }
    if (!t) {
      var obj = {}
      var len = path.length
      var i = 0
      var s = obj
      while (i < len && (s = s[path[i++]] = {}));
      state.set(obj)
      t = getPath(tree, path)
    }
    return t._[uid]
  } else {
    return tree._[uid]
  }
}

},{"../element":2,"../get":9,"./render":29,"brisky-stamp":48,"brisky-struct":55,"brisky-struct/lib/subscribe":73}],29:[function(require,module,exports){
var render = require('./state')

module.exports = function (state, type, subs, tree) {
  var _ = subs._
  if (_) {
    if (type !== 'update') {
      var traveler = _.tList
      if (traveler) {
        for (var i = 0, len = traveler.length; i < len; i += 4) {
          render(traveler[i + 3], state, type, subs, tree, traveler[i], traveler[i + 1], traveler[i + 2])
        }
      }
    } else if (_.sList) {
      var specific = _.sList
      for (var i$1 = 0, len$1 = specific.length; i$1 < len$1; i$1 += 4) {
        render(specific[i$1 + 3], state, type, subs, tree, specific[i$1], specific[i$1 + 1], specific[i$1 + 2])
      }
    }
  }
}

},{"./state":30}],30:[function(require,module,exports){
var widgets = require('../widget/widgets') // better to store on the root -- prevent mismatch
var ref = require('../get');
var isWidget = ref.isWidget;

module.exports = function (t, state, type, subs, tree, id, pid, order) {
  if (type === 'remove') {
    for (var i = widgets.length - 1; i >= 0; i = i - 3) {
      var wtree = widgets[i]
      var ptree = wtree
      while (ptree) {
        if (tree === ptree) {
          emitRemove(widgets[i - 2], state, wtree, widgets[i - 1])
          widgets.splice(i - 2, 3)
        }
        ptree = ptree._p
      }
    }
    if (onRemove(t) && !isWidget(t)) {
      emitRemove(t, state, tree, id)
    }
  } else if (!tree._) {
    tree._ = {}
  }
  return t.render.state(t, state, type, subs, tree, id, pid, order)
}

var emitRemove = function (t, state, tree, id) {
  var data = { target: tree._ && tree._[id], state: state }
  t.emit('remove', data, state.stamp)
}

var onRemove = function (t, key) { return t.emitters && t.emitters.remove ||
  t.inherits && onRemove(t.inherits); }

},{"../get":9,"../widget/widgets":46}],31:[function(require,module,exports){
var isStatic = function (t) { return t.isStatic !== void 0
  ? t.isStatic
  : t.inherits && isStatic(t.inherits); }

var staticProps = function (t) { return t.staticProps ||
  (t.staticProps = t.filter(function (t) { return !t.isElement && isStatic(t); })); }

var staticElements = function (t) { return t.staticElements ||
  (t.staticElements = t.filter(function (t) { return t.isElement && isStatic(t); })); }

exports.property = function (t, div, param) {
  var props = staticProps(t)
  for (var i = 0, len = props.length; i < len; i++) {
    props[i].render.static(props[i], div, param)
  }
  return props
}

exports.element = function (t, div) {
  var elements = staticElements(t)
  for (var i = 0, len = elements.length; i < len; i++) {
    elements[i].render.static(elements[i], div)
  }
  return elements
}

exports.staticProps = staticProps

exports.staticElements = staticElements

exports.isStatic = isStatic

},{}],32:[function(require,module,exports){
var globSwitch = require('./map/type/switcher/glob')
var ref = require('../get');
var get$any = ref.get$any;
var get$switch = ref.get$switch;

exports.props = {
  $: function $ (t, val) {
    if (typeof val === 'number' && !isNaN(val)) {
      val = [ val + '' ]
    } else if (typeof val === 'string') {
      val = val.split('.')
    }
    if (Array.isArray(val)) {
      var length = val.length
      var last = val[length - 1]
      if (last === '$any') {
        t.$any = true
        length--
      } else if (get$any(t)) {
        t.$any = null
      } else if (last === '$switch') {
        if (!get$switch(t)) { t.$switch = globSwitch }
      } else if (get$switch(t)) {
        t.$switch = null
      }
      t._$length = length
    } else {
      t._$length = null
    }
    t.$ = val
    return true
  },
  _$path: true, // what do we use this for?
  isStatic: true,
  $switch: true,
  $any: true,
  // sync: true,
  subscriptionType: true,
  render: function render (t, val) {
    t.set({
      define: {
        render: val
      }
    })
  }
}

exports.subscriptionType = 1
exports.inject = require('./map')

},{"../get":9,"./map":33,"./map/type/switcher/glob":42}],33:[function(require,module,exports){
var iterator = require('./iterator')
var switcher = require('./type/switcher')
var any = require('./type/any')
var normal = require('./type')
// const object = require('./type/object')
var ref = require('../../get');
var get$ = ref.get$;
var get$any = ref.get$any;
var get$switch = ref.get$switch;
var subscriber = require('./subscriber')

// dont define just require
module.exports = {
  define: {
    $map: function $map (map, prev, ignoreSwitch) {
      var returnValue
      var $ = get$(this)
      if (!map) {
        returnValue = map = this._$map = { _: { p: prev || false } }
      }
      this.isStatic = null
      if ($) {
        // if (typeof $ === 'object' && !($ instanceof Array)) {
        //   // if (!returnValue) { returnValue = true }
        //   // map = object(this, map)
        // } else {
        if ($[0] === 'root' && (!map || !map._ || !map._.p)) { $.shift() }

        if (!returnValue) { returnValue = true }
        if (get$switch(this) && !ignoreSwitch) {
          map = switcher(this, map)
        } else if (get$any(this)) {
          map = any(this, map)
        } else {
          map = normal(this, map)
        }
        // }
      } else if (iterator(this, map) || returnValue) {
        subscriber(map, this, 't')
        if (!returnValue) { returnValue = true }
      }

      return returnValue
    }
  }
}

},{"../../get":9,"./iterator":34,"./subscriber":38,"./type":41,"./type/any":40,"./type/switcher":43}],34:[function(require,module,exports){
var isNull = function (t) { return t.val === null || t.inherits && isNull(t.inherits); }
var ref = require('brisky-struct/lib/get');
var get = ref.get;

module.exports = function (t, map, prevMap) {
  var changed
  var keys = t.keys()

  if (keys) {
    var i = keys.length
    while (i--) {
      var p = get(t, keys[i])
      if (p && !isNull(p) && p.$map) {
        if (exec(p, map, prevMap)) { changed = true }
      }
    }
  }
  return changed
}

function exec (p, map, prevMap) {
  var change = p.$map(map, prevMap)

  if (change) {
    return true
  } else {
    // this can be removed the 1 thing
    p.isStatic = true
  }
}

},{"brisky-struct/lib/get":54}],35:[function(require,module,exports){
var mergeS = require('./subscriber/merge')
var ref = require('../../get');
var getPath = ref.getPath;
var set = require('./set')
var val = require('./val')

module.exports = exports = function (t, subs, val, map) {
  var field = getPath(map, subs)

  if (field) {
    if (subs.length > 1) {
      for (var i = 0, len = subs.length - 1, m = map, key; i < len; i++) {
        key = subs[i]
        m = m[key]
        if (m.$blockRemove) { m.$blockRemove = false }
      }
    }
    merge(t, field, val)
    return field
  } else {
    return set(t, val, map, subs)
  }
}

var merge = function (t, a, b) {
  if (b && typeof b !== 'object') {
    if (!a.val) { a.val = b }
  } else {
    if (typeof b === 'object') {
      if (!b._) {
        b._ = {}
      }
      b._.p = a._.p
    }
    for (var i in b) {
      if (i === 'props') {
        if (!a.props) {
          a.props = {}
        }
        for (var j in b.props) {
          a.props[j] = b.props[j]
          for (var n in b.props[j]) {
            if (typeof b.props[j][n] === 'object') {
              b.props[j][n]._.p = a._.p
            }
          }
        }
      } else if (i !== '_') {
        if (typeof a[i] === 'object') {
          merge(t, a[i], b[i])
        } else if (!a[i]) {
          if (typeof b[i] === 'object' && b[i]._) {
            b[i]._.p = a
          }
          a[i] = b[i]
        } else if (i === 'val') {
          // alse remove this specific true thing
          if (a.val !== b.val && b.val === true) {
            // pretty wrong since i need the info of the t in the def
            val(t, a, true)
          }
        } else {
          var prev = a[i]
          // maybe copy sync?
          a[i] = { _: { p: a } }
          val(t, a[i], prev)
          merge(t, a[i], b[i])
        }
      } else {
        mergeS(a._, b._)
      }
    }
  }
}

},{"../../get":9,"./set":36,"./subscriber/merge":39,"./val":44}],36:[function(require,module,exports){
'use strict'
var setVal = require('./val')

module.exports = function set (target, val, map, path) {
  var len = path.length - 1
  if (len === 0) {
    map[path[0]] = val
    val._ = { p: map }
    if (val.val) {
      var subsVal = val.val
      delete val.val
      setVal(target, val, subsVal)
    }
  } else {
    var m = map
    for (var i = 0, key; i < len; i++) {
      key = path[i]
      if (!m[key]) {
        m[key] = { _: { p: m }, $blockRemove: false } // $blockRemove: false - should not be nessecary
      }
      m = m[key]
    }
    m[path[len]] = val
    val._ = { p: m }
    if (val.val) {
      var subsVal$1 = val.val
      delete val.val
      setVal(target, val, subsVal$1)
    }
  }
  return val
}

},{"./val":44}],37:[function(require,module,exports){
var contextKey = function (t) { return t.storeContextKey !== void 0
  ? t.storeContextKey
  : t.inherits && contextKey(t.inherits); }

module.exports = function (t) {
  if (contextKey(t)) {
    var key = t.parent().key
    return key ? 'c' + key + '-' + genCid(t) : 'c' + genCid(t)
  } else {
    return 'c' + genCid(t)
  }
}

var genCid = function (t) {
  if (t.context) {
    if (t.contextLevel === 1) {
      return t.uid() + '' + genCid(t.context) // wrong
    } else {
      return t.uid() + '' + genCid(t._p)
    }
  } else {
    return t.uid()
  }
}

},{}],38:[function(require,module,exports){
var context = require('./context')

module.exports = function (target, obs, type) {
  var _ = target._
  var store = _[type] || (_[type] = {})
  var pid, id, parent, index

  if (obs.context) {
    parent = getParent(obs.parent())
    id = context(obs)
    pid = parent.context ? context(parent) : parent.uid()
  } else {
    id = obs.uid()
    parent = getParent(obs.parent())
    pid = parent && parent.uid()
  }
  index = obs.findIndex(parent)
  if (!store[id]) {
    if (target.$blockRemove !== false) {
      target.$blockRemove = true
    }

    store[id] = obs
    if (type === 's') {
      if (!_.sList) { _.sList = [] }
      _.sList.unshift(id, pid, index, obs)
    }
    if (!_.tList) { _.tList = [] }
    _.tList.unshift(id, pid, index, obs)
  }
  return target
}

var getParent = function (parent) {
  while (parent) {
    if (parent.isElement) {
      return parent
    }
    parent = parent.parent()
  }
}

},{"./context":37}],39:[function(require,module,exports){
module.exports = function (a, b) {
  if (b.t) {
    if (!a.t) { a.t = {} }
    for (var uid in b.t) {
      a.t[uid] = b.t[uid]
    }
    if (!b.s) {
      a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
    }
  }
  if (b.s) {
    if (!a.s) { a.s = {} }
    for (var uid$1 in b.s) {
      a.s[uid$1] = b.s[uid$1]
    }
    a.sList = a.sList ? a.sList.concat(b.sList) : b.sList
    a.tList = a.tList ? a.tList.concat(b.tList) : b.tList
  }
}

},{}],40:[function(require,module,exports){
var merge = require('../merge')
var subscriber = require('../subscriber')
var iterator = require('../iterator')
var setVal = require('../val')
var ref = require('../../../get');
var get$ = ref.get$;
var get$switch = ref.get$switch;

module.exports = function (t, map) {
  var props = t.get('props')
  var child = props.default.struct

  var $ = get$(t)

  child.key = 'default'
  if (t.context || t !== child._p) {
    // console.log('IN CONTEXT', child)
    child.context = t
    child.contextLevel = 1
  }

  if ($.length !== 1) {
    var path = $.slice(0, -1)
    var val = { val: 1 } // wrong for switch .. what to do
    var walk = map
    var exists
    val.$any = child.$map(void 0, exists ? walk : val)
    if (!val.$any.val) {
      if (!get$switch(child)) {
        setVal(child, val.$any, 1)
      }
    }
    // if (!child.$test && child.sync !== false && val.$any._.sync === true) {
    //   val.$any._.sync = 1
    // }
    // val.$remove = true
    map = merge(t, path, val, map)
  } else {
    map.$any = child.$map(void 0, map)
    if (!map.$any.val) {
      if (!get$switch(child)) {
        setVal(child, map.$any, 1)
      }
    }
    // if (!child.$test && child.sync !== false && map.$any._.sync === true) {
    //   map.$any._.sync = 1
    // }
  }

  iterator(t, map)
  subscriber(map, t, 't')

  return map
}

},{"../../../get":9,"../iterator":34,"../merge":35,"../subscriber":38,"../val":44}],41:[function(require,module,exports){
var merge = require('../merge')
var iterator = require('../iterator')
var subscriber = require('../subscriber')
var val = require('../val')

var ref = require('../../../get');
var get$ = ref.get$;
var getType = ref.getType;

module.exports = function (t, map) {
  var def = getType(t)
  var path = get$(t)
  var type = def === 1 ? 't' : 's'
  if (path !== true) {
    map = merge(t, path, { val: def }, map)
  } else {
    val(t, map, def)
  }
  iterator(t, map)
  subscriber(map, t, type)
  return map
}

},{"../../../get":9,"../iterator":34,"../merge":35,"../subscriber":38,"../val":44}],42:[function(require,module,exports){
module.exports = function (t, subs, tree, key) {
  var computed = t.compute()
  if (computed) {
    var store = subs.props[key]
    var path = t.origin().path()
    var eligable, level, length
    for (var field in store) {
      if (field[0] !== '$exec' && field[0] !== 'self') {
        if (!length) { length = path.length }
        var glob = field.split('.')
        var l = glob.length
        if (length >= l) {
          if (!level || l >= level) {
            var delta = length - l
            var score = 0
            for (var i = l - 1, weight = 2; i >= 0; i--) {
              var key$1 = glob[i]
              weight++
              if (key$1 === path[i + delta]) {
                score += weight
              } else if (key$1 === '*') {
                score += 1
              } else {
                score = false
                break
              }
            }
            if (score) {
              if (!eligable) { eligable = [] }
              if (!(l in eligable)) { eligable[l] = [] }
              eligable[l][score] = field
              level = l
            }
          }
        }
      }
    }
    if (eligable) {
      var candidates = eligable[level]
      return candidates[candidates.length - 1]
    }
  }
}

},{}],43:[function(require,module,exports){
var merge = require('../../merge')
// const hash = require('quick-hash') // avoid this one
var ref = require('../../../../get');
var get$ = ref.get$;
var get$switch = ref.get$switch;
var ref$1 = require('brisky-struct/lib/get');
var get = ref$1.get;

var helper = function (struct, subs, tree, key) {
  var store = subs.props[key]
  var $exec = store.$exec
  var result = $exec(struct, subs, tree, key)
  if (result === true) {
    result = store.self
  } else {
    var type = typeof result
    if (type === 'number' || type === 'string') {
      result = store[result]
    }
  }
  return result
}

module.exports = function (t, map, prevMap) {
  var $ = get$(t)
  var key = '$switch-' + t.path().join('-')
  $[$.length - 1] = key
  if ($.length !== 1) {
    var val = {}
    map = merge(t, $.slice(0, -1), val, map)
    mapSwitch(map, key, t, map, $)
  } else {
    mapSwitch(map, key, t, map, $)
  }
  return map
}

function mapSwitch (val, key, t, pmap, $) {
  var self = t.$map(void 0, pmap, true)
  var props = get(t, 'props')
  var types = get(t, 'types')
  var blackList
  if (types.element) {
    blackList = types.element.props
  } else {
    blackList = types.struct.props
  }
  var mappedProps = {}
  if (!val.props) { val.props = {} }
  val.props[key] = mappedProps

  // val.$blockRemove = true // <---- lets see...

  // object sypport
  var $switch = get$switch(t)
  if (typeof $switch === 'object') {
    mappedProps.$exec = $switch.val
    var n = {}
    for (var key$1 in $switch) {
      n[key$1] = $switch[key$1]
    }
    n.val = helper
    $switch = n
    // n._ = { p: val }
    n.props = val.props // bit weird...
  } else {
    mappedProps.$exec = $switch
    $switch = helper
  }

  var len = $.length
  var select = self
  for (var i = 0; i < len; i++) { select = select[$[i]] }
  select._.p = pmap._.p
  mappedProps.self = select
  if (!select.val) { select.val = 1 }

  for (var key$2 in props) {
    var keyO = key$2[0]
    if (
      keyO !== '$' && keyO !== '_' &&
      (!blackList[key$2] || blackList[key$2] !== props[key$2])
    ) {
      var prop = props[key$2]
      var struct = prop.struct
      if (struct && struct.$map) { // is element or is property
        struct.key = key$2
        if (t.context) {
          struct.context = t.context
          struct.contextLevel = 1
        } else {
          struct.context = t._p
          struct.contextLevel = 1
        }
        struct.indexProperty = t
        var map = struct.$map(void 0, pmap)
        mappedProps[key$2] = map
        map._.p = pmap._.p
        if (!map.val) { map.val = 1 }
        delete struct.indexProperty
      }
    }
  }

  val[key] = $switch

  return val
}

},{"../../../../get":9,"../../merge":35,"brisky-struct/lib/get":54}],44:[function(require,module,exports){
module.exports = function (target, map, val) {
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
  if (val && map.val !== true) {
    map.val = val
  }
}

},{}],45:[function(require,module,exports){
var widgets = require('./widgets')

exports.props = {
  isWidget: {
    type: 'property',
    subscriptionType: 1,
    $: true,
    render: {
      state: function state (target, s, type, subs, tree, id, pid) {
        if (type === 'new') {
          widgets.push(target.parent(), pid, tree)
        }
      }
    }
  }
}

},{"./widgets":46}],46:[function(require,module,exports){
module.exports = []

},{}],47:[function(require,module,exports){
'use strict'
module.exports = require('./lib/render')

},{"./lib/render":28}],48:[function(require,module,exports){
(function (global){
if (global.briskystamp) {
  module.exports = global.briskystamp
} else {
  global.briskystamp = exports

  var on

  exports.cnt = 0
  // add timestamp option -- maybe allways use it

  exports.create = function (type, src, override) {
    var stamp = override || ++exports.cnt
    if (type) {
      stamp = type + '-' + stamp
    }
    if (src) {
      stamp = src + '|' + stamp
    }
    return stamp
  }

  exports.on = function (fn) {
    if (!on) {
      on = [ fn ]
    } else {
      on.push(fn)
    }
  }

  exports.close = function () {
    if (on) {
      for (var i = 0; i < on.length; i++) {
        on[i]()
      }
      on = false
    }
  }

  exports.clear = function () { on = false }

  exports.parse = function (stamp) {
    var parsed = {}
    var src = exports.src(stamp)
    var type = exports.type(stamp)
    if (src || type) {
      if (src) {
        parsed.src = src
        if (type) {
          parsed.type = type
          parsed.val = stamp.slice(stamp.indexOf(type) + type.length + 1)
        } else {
          parsed.val = stamp.slice(stamp.indexOf('|') + 1)
        }
      } else {
        parsed.type = type
        parsed.val = stamp.slice(stamp.indexOf(type) + type.length + 1)
      }
    } else {
      parsed.val = stamp
    }
    return parsed
  }

  exports.src = function (stamp) {
    if (typeof stamp === 'string') {
      for (var i = 1, len = stamp.length - 2; i < len; i++) {
        if (stamp.charAt(i) === '|') {
          return stamp.slice(0, i)
        }
      }
    }
  }

  exports.val = function (stamp) {
    if (typeof stamp === 'string') {
      for (var i = stamp.length - 1; i > 0; i--) {
        if (stamp.charAt(i) === '-') {
          return stamp.slice(i + 1)
        }
      }
      for (var i$1 = 1, len = stamp.length - 2; i$1 < len; i$1++) {
        if (stamp.charAt(i$1) === '|') {
          return stamp.slice(i$1 + 1)
        }
      }
      return stamp
    } else {
      return stamp
    }
  }

  exports.hasSrc = function (stamp) {
    if (typeof stamp === 'string') {
      for (var i = 1, len = stamp.length - 2; i < len; i++) {
        if (stamp.charAt(i) === '|') {
          return i
        }
      }
    }
  }

  exports.setSrc = function (stamp, val) { return val + '|' + stamp; }

  exports.type = function (stamp, src) {
    if (typeof stamp === 'string') {
      var index
      if (!src) {
        src = -1
        for (var j = 1; j < stamp.length - 2; j++) {
          if (stamp.charAt(j) === '|') {
            src = j
            break
          }
        }
      }
      for (var i = stamp.length - 2; i > src + 1; i--) {
        var char = stamp.charAt(i)
        if (char === '-') {
          index = i
          break
        }
      }
      if (index) {
        return stamp.slice(src + 1, index)
      }
    }
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
var bs = require('brisky-stamp')
var ref = require('./emit');
var generic = ref.generic;
var ref$1 = require('./traversal');
var root = ref$1.root;
var uid = 0
var set

var extendSet = function (t, val, stamp) {
  if (stamp) {
    stamp = bs.create(bs.type(stamp), bs.src(stamp))
    set(t, val, stamp)
    bs.close(stamp)
  } else {
    set(t, val)
  }
}

var error = function (t, err, stamp) { return generic(root(t), 'error', err, stamp); }

var isGeneratorFunction = function (obj) {
  var constructor = obj.constructor
  return constructor && (constructor.name === 'GeneratorFunction' ||
    constructor.displayName === 'GeneratorFunction') ||
    typeof constructor.prototype.next === 'function'
}

var generator = function (t, val, stamp) { return iterator(t, val(t, stamp), stamp); }

var promiseQueue = function (t, uid, val, error) {
  if (t.async) {
    for (var i = 0, end = t.async.length - 2; i < end; i += 3) {
      if (t.async[i + 2] === uid) {
        t.async[i] = val
        t.async[i + 2] = void 0
        if (i === 0) { execPromise(t) }
        break
      }
    }
  }
}

var done = function (t) {
  t.async.splice(0, 3)
  if (t.async.length) { queue(t) }
  if (t.async && !t.async.length) {
    delete t.async
  }
}

var queue = function (t) {
  var async = t.async[0]
  if (async && async.next) {
    execIterator(t, async, t.async[1], t.async[2], done)
  } else if (!t.async[2]) {
    execPromise(t)
  }
}

var execPromise = function (t) {
  var async = t.async[0]
  if (async !== void 0) {
    if (Array.isArray(async)) {
      for (var i = 0, len = async.length; i < len; i++) {
        extendSet(t, async[i], t.async[1])
      }
    } else {
      extendSet(t, async, t.async[1])
    }
  }
  done(t)
}

var next = function (iteratee, t, stamp, val) {
  try {
    return iteratee.next()
  } catch (err) {
    error(t, err, stamp)
    done(t)
  }
}

var execIterator = function (t, iteratee, stamp, id, done, val) {
  if (t.async && t.async[2] === id) {
    if (!val || !val.done) {
      if (val !== void 0) {
        if (
          val.value &&
          typeof val.value === 'object' &&
          typeof val.value.then === 'function'
        ) {
          val.value.then(function (resolved) {
            if (t.async && t.async[2] === id) {
              extendSet(t, resolved, stamp)
              execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
            }
          })
        } else {
          extendSet(t, val.value, stamp)
          execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
        }
      } else {
        execIterator(t, iteratee, stamp, id, done, next(iteratee, t, stamp))
      }
    } else if (val.done) {
      done(t)
    }
  }
}

var iterator = function (t, iteratee, stamp, val) {
  var id = ++uid
  if (!t.async) {
    t.async = [ iteratee, stamp, id ]
    queue(t)
  } else {
    t.async.push(iteratee, stamp, id)
  }
}

var promise = function (t, promise, stamp) {
  var id = ++uid
  if (!t.async) {
    t.async = [ void 0, stamp, id ]
    queue(t)
  } else {
    t.async.push(void 0, stamp, id)
  }
  promise
    .then(function (val) { return promiseQueue(t, id, val); })
    .catch(function (err) {
      error(t, err, stamp)
      promiseQueue(t, id, void 0, err)
    })
}

exports.isGeneratorFunction = isGeneratorFunction
exports.promise = promise
exports.generator = generator
exports.iterator = iterator

set = require('./manipulate').set

},{"./emit":52,"./manipulate":58,"./traversal":79,"brisky-stamp":48}],50:[function(require,module,exports){
var get = function (t) { return t.val !== void 0 ? t.val : t.inherits && get(t.inherits); }

var origin = function (t) { return t.val && typeof t.val === 'object' && t.val.inherits
  ? origin(t.val) : t; }

var transform = function (t) { return t.$transform !== void 0
  ? t.$transform
  : t.inherits && transform(t.inherits); }

var compute = function (t, val, passon) {
  if (val === void 0) {
    val = t.val
    if (val === void 0) { val = get(t.inherits) }
  }
  if (val) {
    var type = typeof val
    if (type === 'object') {
      if (val.inherits) {
        var v = val
        val = compute(val)
        if (val === void 0) {
          val = v
        }
      }
    } else if (type === 'function') {
      val = val(val, passon || t)
    }
  }
  var trans = transform(t)
  return trans ? trans(val, passon || t) : val
}

exports.origin = origin
exports.compute = compute

},{}],51:[function(require,module,exports){
var ref = require('./get');
var get = ref.get;
var ref$1 = require('./keys');
var removeContextKey = ref$1.removeContextKey;
var ref$2 = require('./manipulate');
var create = ref$2.create;

var resolveContext = function (t, val, stamp) {
  var level = t.contextLevel
  var cntx = t.context
  var key
  if (cntx.context) {
    cntx = resolveContext(cntx, void 0, stamp)
  }
  if (level > 1) {
    var path = []
    var parent = t._p
    while (--level) {
      path.unshift(parent.key)
      parent = parent._p
    }
    key = path[0]
    var inherits = get(cntx, key, true)
    contextProperty(cntx, void 0, stamp, key, inherits)
    inherits.context = null
    inherits.contextLevel = null
    cntx = cntx[key]
    for (var i = 1, len = path.length; i < len; i++) {
      key = path[i]
      inherits = get(cntx, key, true)
      cntx[key] = create(inherits, void 0, stamp, cntx, key)
      inherits.context = null
      inherits.contextLevel = null
      cntx = cntx[key]
    }
    key = t.key
  } else {
    key = t.key
  }
  t.context = null
  t.contextLevel = null
  return contextProperty(cntx, val, stamp, key, get(cntx, key, true))
}

var contextProperty = function (t, val, stamp, key, property) {
  if (val === null) {
    removeContextProperty(t, key)
    return val
  } else {
    var result = create(property, val, stamp, t, key)
    t[key] = result
    return result
  }
}

var removeContextProperty = function (t, key) {
  t[key] = void 0
  removeContextKey(t, key)
}

/**
 * @function storeContext
 * stores context for reapplying with applyContext
 * @todo: needs perf optmization
 * @return {array} returns store
 */
var storeContext = function (t) {
  var context = t.context
  if (context) {
    var arr = []
    var level = t.contextLevel
    while (context) {
      arr.push(context, level)
      level = context.contextLevel
      context = context.context
    }
    return arr
  }
}

/**
 * @function applyContext
 * applies context to base
 */
var applyContext = function (t, store) {
  if (store) {
    var l = store.length
    var ret
    for (var i = 0, target = t; i < l; i = i + 2) {
      var context = store[i]
      var level = store[i + 1]
      var path = [ target ]
      var newTarget = setContext(target, context, level, path)
      var base = handleChange(target, context, path, level)
      if (ret === void 0 && base !== void 0) {
        ret = base
      }
      if (newTarget) {
        target = newTarget
      }
    }
    return ret
  }
}

var handleChange = function (target, context, path, level) {
  var newContext, newLevel
  var travelTaget = context
  if (context._p && context._p[context.key] === null) {
    return null
  }
  for (var i = 0, len = path.length; i < len; i++) {
    var segment = path[i]
    var field = get(travelTaget, segment.key)
    // delete does not work.... like this does not set null anymore
    if (!field || field.val === null) {
      removeContext(target, level)
      return null
    } else if (field !== segment) {
      segment.context = null
      segment.contextLevel = null
      newContext = field
      newLevel = len - (i + 1)
    }
    travelTaget = field
    if (i === len - 1) {
      target = travelTaget
    }
  }
  if (newContext) {
    if (!newLevel) {
      removeContext(target, level)
    } else {
      setContext(target, newContext, newLevel)
    }
    return target
  }
}

var setContext = function (target, context, level, path) {
  if (level) {
    target.contextLevel = level
    target.context = context
    if (level > 1) {
      var p = target._p
      for (var i = 1; p && i < level; i++) {
        if (path) { path.unshift(p) }
        p.context = context
        p.contextLevel = target.contextLevel - i
        p = p._p
      }
    }
    return context
  }
}

var removeContext = function (target, level) {
  if (level) {
    target.contextLevel = null
    target.context = null
    if (level > 1) {
      var p = target._p
      for (var i = 1; p && i < level; i++) {
        p.context = null
        p.contextLevel = null
        p = p._p
      }
    }
  }
}

exports.contextProperty = contextProperty
exports.resolveContext = resolveContext

// split off apply/store
exports.applyContext = applyContext
exports.storeContext = storeContext

},{"./get":54,"./keys":57,"./manipulate":58}],52:[function(require,module,exports){
var ref = require('./get');
var getFn = ref.getFn;

var onData = function (t) { return t.emitters && t.emitters.data ||
  t.inherits && onData(t.inherits); }

var onGeneric = function (t, key) { return t.emitters && t.emitters[key] ||
  t.inherits && onGeneric(t.inherits, key); }

var updateContext = function (context, t, val, stamp, key, resolve, level, j, fn) {
  if (!(key in context)) {
    var n = j
    if (resolve.context !== context) {
      resolve.context = context
      resolve.contextLevel = level
      while (n--) { fn[n](val, stamp, t) }
      if (context._p) {
        if (emitContext(t, val, stamp, context._p, context.key, context, 1, j, fn)) {
          context.context = null
          context.contextPath = null
        }
      }
      if (context.instances) {
        var i = context.instances.length
        while (i--) {
          updateContext(context.instances[i], t, val, stamp, key, resolve, level, j, fn)
        }
      }
    }
    return true
  }
}

var emitContext = function (t, val, stamp, parent, key, resolve, level, j, fn) {
  var clear
  if (parent._c !== t) {
    if (parent.instances) {
      var i = parent.instances.length
      while (i--) {
        if (updateContext(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
          clear = true
        }
      }
    }
    if (parent._p) {
      if (emitContext(t, val, stamp, parent._p, parent.key, resolve, level + 1, j, fn)) {
        clear = true
      }
    }
  }
  return clear
}

var fn = function (t, val, stamp, emitter) {
  var listeners = getFn(emitter)
  if (listeners) {
    var i = listeners.length
    if (i && t._p) {
      if (emitContext(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextPath = null
      }
    }
    while (i--) { listeners[i](val, stamp, t) }
  } else {
    emitter.listeners = []
  }
}

// need to be able to pass a tStamp (void 0 for incoming hub stuff)
/*
if (parent._emitters._data.base) {
  parent._emitters._data.base.each(function (p) {
    looper(p, val, stamp)
  })
}
*/

// needs base and ofc context! and instances!
// so emitters seem pretty perfect for this job...

var execSubs = function (p, stamp) {
  var i = p.subscriptions.length
  while (i--) { p.subscriptions[i](stamp) }
}

// this is wrong need to do it differently
var setStamp = function (t, stamp) {
  t.tStamp = stamp
  if (t._p) {
    var p = t._p
    while (p && p.tStamp !== stamp) {
      // need to update t.stamps on things that are referenced
      // also need to handle stamp + tStamp
      p.tStamp = stamp
      // can also be on thing it inherits from ?
      // no exception for subs
      if (p.emitters && p.emitters.data && p.emitters.data.struct) {
        var i = p.emitters.data.struct.length
        while (i--) {
          setStamp(p.emitters.data.struct[i], stamp)
        }
      }
      if (p.subscriptions) { execSubs(p, stamp) }
      p = p._p
    }
  }
  if (t.subscriptions) {
    execSubs(t, stamp)
  }
}

var data = function (t, val, stamp) {
  if (t.stamp !== stamp) {
    t.stamp = stamp
    setStamp(t, stamp)
    var own = t.emitters && t.emitters.data
    if (own) {
      var struct = own.struct
      fn(t, val, stamp, own)
      if (struct) {
        var i = struct.length
        while (i--) { updateStruct(struct[i], val, stamp) }
      }
    } else {
      var emitter = onData(t.inherits)
      if (emitter) { fn(t, val, stamp, emitter) }
    }
  }
}

var updateStruct = function (t, val, stamp) {
  // should allready update all tStamps
  data(t, val, stamp)
  if (t.instances) {
    var i = t.instances.length
    while (i--) {
      if (t.instances[i].val === void 0) {
        updateStruct(t.instances[i], val, stamp)
      }
    }
  }
}

var generic = function (t, type, val, stamp) {
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    var emitter = onGeneric(t, type)
    if (emitter) { fn(t, val, stamp, emitter) }
  }
}

exports.onData = onData
exports.data = data
exports.generic = generic

},{"./get":54}],53:[function(require,module,exports){
var ref = require('./');
var get = ref.get;
var getOrigin = ref.getOrigin;
var ref$1 = require('../manipulate');
var set = ref$1.set;

module.exports = function (t, key, val, stamp) {
  var bind
  if (typeof key === 'object') {
    if (val !== void 0) {
      for (var i = 0, len = key.length; t && i < len; i++) {
        bind = t
        t = getOrigin(t, key[i])
        if (!t) {
          var obj;
          set(bind, ( obj = {}, obj[key[i]] = i === len - 1 ? val : {}, obj ), stamp)
          t = get(bind, key[i])
        }
        if (typeof t === 'function') { t = bind[key[i]]() }
      }
    } else {
      for (var i$1 = 0, len$1 = key.length; t && i$1 < len$1; i$1++) {
        bind = t
        t = get(t, key[i$1]) || getOrigin(t, key[i$1])
        if (typeof t === 'function') { t = bind[key[i$1]]() }
      }
    }
    return t
  } else {
    bind = t
    t = getOrigin(t, key)
    if (!t && val !== void 0) {
      var obj$1;
      set(bind, ( obj$1 = {}, obj$1[key] = val, obj$1 ), stamp)
      t = get(bind, key)
    } else {
      if (typeof t === 'function') { t = bind[key]() }
    }
    return t
  }
}

},{"../manipulate":58,"./":54}],54:[function(require,module,exports){
var get = function (t, key, noContext) {
  if (key in t) {
    var result = t[key]
    if (!noContext && result && result.inherits) {
      if (t.context) {
        result.context = t.context
        result.contextLevel = t.contextLevel + 1
      } else if (result.context) {
        result.context = null
        result.contextLevel = null
      }
    }
    return result
  } else if (t.inherits) {
    var result$1 = get(t.inherits, key, true)
    if (!noContext && result$1 && result$1.inherits) {
      result$1.context = t
      result$1.contextLevel = 1
    }
    return result$1
  }
}

var getOrigin = function (t, key) {
  if (t) {
    var result = get(t, key)
    if (result !== void 0 && result !== null) {
      return result
    } else {
      return (t = t.val) && typeof t === 'object' && t.inherits && getOrigin(t, key)
    }
  }
}

var getFn = function (t) { return t.fn || t.inherits && getFn(t.inherits); }

var getDefault = function (t) { return t.props && t.props.default.struct || getDefault(t.inherits); }

exports.getFn = getFn
exports.get = get
exports.getDefault = getDefault
exports.getOrigin = getOrigin

},{}],55:[function(require,module,exports){
var struct = require('./struct')
var ref = require('./manipulate');
var create = ref.create;
var set = ref.set;
set(struct, { inject: require('./methods') })
module.exports = function (val, stamp) { return create(struct, val, stamp); }

},{"./manipulate":58,"./methods":60,"./struct":66}],56:[function(require,module,exports){
var ref = require('./keys');
var addKey = ref.addKey;
var copy = ref.copy;
var ref$1 = require('./emit');
var data = ref$1.data;

var update = function (t, val, key, resolved) {
  if (!(key in t)) {
    if (key !== 'val') {
      if (val[key] !== null) {
        if (!resolved) {
          if (t._ks) {
            addKey(t, key)
          } else {
            copy(t)
            return 1
          }
        }
      }
    }
    return true
  } else {
    if (val[key] === null && t[key]) {
      if (!t._ks) {
        copy(t)
        addKey(t, key)
        return 1
      } else {
        addKey(t, key) // no update
      }
    }
  }
}

var propertyKeys = function (t, val, stamp, changed, resolved) {
  var j = changed.length
  var inherits
  if (t.instances) {
    while (j--) {
      var key = changed[j]
      var res = update(t, val, key, resolved)
      if (res) {
        if (res !== true) { resolved = res }
        if (!inherits) {
          inherits = [ key ]
        } else {
          inherits.push(key)
        }
      }
    }
    if (inherits) {
      if (stamp) { data(t, val, stamp) }
      propertyChange(t, val, stamp, inherits, resolved)
    }
  } else {
    while (j--) {
      inherits = update(t, val, changed[j], resolved)
      if (inherits === 1) { resolved = inherits }
    }
    if (inherits && stamp) { data(t, val, stamp) }
  }
}

var propertyChange = function (t, val, stamp, changed, resolved) {
  var instances = t.instances
  var i = instances.length
  while (i--) {
    var instance = instances[i]
    propertyKeys(instance, val, stamp, changed, resolved)
  }
}

var valChange = function (t, val, stamp, changed) {
  var instances = t.instances
  var i = instances.length
  while (i--) {
    var instance = instances[i]
    if (instance.val === void 0) {
      if (stamp) { data(instance, val, stamp) }
      if (instance.instances) { valChange(instance, val, stamp, changed) }
    }
  }
}

var instances = function (t, val, stamp, changed) {
  if (changed === true) {
    valChange(t, val, stamp, changed)
  } else {
    propertyChange(t, val, stamp, changed)
  }
}

module.exports = instances

},{"./emit":52,"./keys":57}],57:[function(require,module,exports){
var removeKey = function (t, key) {
  if (t._ks) {
    var keys = t._ks
    var i = keys.length
    while (i--) {
      if (keys[i] === key) {
        keys.splice(i, 1)
        break
      }
    }
  }
}

var removeContextKey = function (t, key) {
  if (!t._ks) {
    var keys = getKeys(t.inherits)
    if (keys) {
      var b = []
      for (var i = 0, j = 0, len = keys.length; i < len; i++) {
        if (keys[i] === key) {
          j = 1
        } else {
          b[i - j] = keys[i]
        }
      }
      t._ks = b
    }
  } else {
    removeKey(t, key)
  }
}

var copy = function (t) {
  var keys = getKeys(t.inherits)
  if (keys) {
    var len = keys.length
    var i = len
    var b = t._ks = []
    while (i--) { b[i] = keys[i] }
    return len
  }
}

var addKey = function (t, key) {
  if (!t._ks) {
    var keys = getKeys(t.inherits)
    if (keys) {
      var len = keys.length
      var i = len
      var b = t._ks = []
      while (i--) { b[i] = keys[i] }
      b[len] = key
    } else {
      t._ks = [ key ]
    }
  } else {
    t._ks.push(key)
  }
}

var getKeys = function (t) { return t._ks || t.inherits && getKeys(t.inherits); }

exports.removeKey = removeKey
exports.addKey = addKey
exports.removeContextKey = removeContextKey
exports.getKeys = getKeys
exports.copy = copy

},{}],58:[function(require,module,exports){
var ref = require('./emit');
var data = ref.data;
var ref$1 = require('./struct/listener');
var listener = ref$1.listener;
var uid = require('./uid')
var instances = require('./instances')
var remove = require('./remove')

var resolveContext, getProp, getType, promise, generator, isGeneratorFunction, iterator

var create = function (t, val, stamp, parent, key) {
  var instance
  if (parent) {
    if (val && typeof val === 'object' && val.type) {
      t = getType(parent, val.type, t) || t
    }
    instance = new t.Constructor()
    instance._p = parent
    instance.inherits = t
    if (key !== void 0) {
      instance.key = key
      parent[key] = instance
    }
  } else {
    instance = new t.Constructor()
    instance.inherits = t
  }
  if (t.instances !== false) {
    if (!t.instances) {
      t.instances = [ instance ]
    } else {
      t.instances.push(instance)
    }
  }
  if (val !== void 0) {
    set(instance, val, stamp)
  }
  return instance
}

var set = function (t, val, stamp) {
  var changed
  if (t.context) {
    return resolveContext(t, val, stamp)
  } else {
    var type = typeof val
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else {
        changed = setVal(t, val)
      }
    } else if (type === 'object') {
      if (!val) {
        remove(t, stamp)
        return true
      } else {
        if (val.inherits) {
          changed = setVal(t, val, true)
        } else if (val.then && typeof val.then === 'function') {
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function') {
          iterator(t, val, stamp)
        } else if (val[0] && val[0] === '@') {
          changed = reference(t, val, stamp)
        } else {
          if (t.instances) {
            for (var key in val) {
              if (
                key !== 'val'
                  ? getProp(t, key)(t, val[key], key, stamp)
                  : setVal(t, val.val, 1, stamp)
              ) {
                if (!changed) {
                  changed = [ key ]
                } else {
                  changed.push(key)
                }
              }
            }
          } else {
            for (var key$1 in val) {
              if (
                key$1 !== 'val'
                  ? getProp(t, key$1)(t, val[key$1], key$1, stamp)
                  : setVal(t, val.val, 1, stamp)
              ) {
                changed = true
              }
            }
          }
        }
      }
    } else {
      changed = setVal(t, val)
    }
  }
  if (changed) {
    if (stamp) { data(t, val, stamp) }
    if (t.instances) { instances(t, val, stamp, changed) }
  }
  return changed
}

var getOnProp = function (t) { return t.props && t.props.on || getOnProp(t.inherits); }

var onContext = function (t, context) {
  if (t.emitters) {
    if (context) {
      t.emitters.context = context
      t.emitters.contextLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

var setVal = function (t, val, ref, stamp) {
  if (t.val !== val) {
    if (t.val && typeof t.val === 'object' && t.val.inherits) {
      listener(t.val.emitters.data, null, uid(t))
    }
    if (ref) {
      if (ref === 1) {
        if (typeof val === 'object') {
          if (!val.inherits) {
            if (val.then && typeof val.then === 'function') {
              promise(t, val, stamp)
              return
            } else if (val.next && typeof val.next === 'function') {
              iterator(t, val, stamp)
              return
            } else if (val[0] && val[0] === '@') {
              return reference(t, val, stamp)
            }
            t.val = val
            return true
          }
        } else {
          t.val = val
          return true
        }
      }
      t.val = val
      if (val.emitters) {
        if (!val.emitters.data) {
          getOnProp(val)(val, { data: void 0 }, 'on')
        }
        listener(val.emitters.data, t, uid(t))
      } else {
        onContext(val)
        getOnProp(val)(val, { data: void 0 }, 'on')
        listener(val.emitters.data, t, uid(t))
      }
    } else {
      t.val = val
    }
    return true
  }
}

exports.set = set
exports.create = create

resolveContext = require('./context').resolveContext
getProp = require('./property').getProp
getType = require('./struct/types').getType
promise = require('./async').promise
isGeneratorFunction = require('./async').isGeneratorFunction
generator = require('./async').generator
iterator = require('./async').iterator

var getApi = require('./get/api')
var reference = function (t, val, stamp) { return set(t, getApi(t, val.slice(1), {}, stamp)); }

},{"./async":49,"./context":51,"./emit":52,"./get/api":53,"./instances":56,"./property":63,"./remove":64,"./struct/listener":68,"./struct/types":70,"./uid":80}],59:[function(require,module,exports){
var ref = require('../get');
var get = ref.get;
var ref$1 = require('../keys');
var getKeys = ref$1.getKeys;
// add every, find, sort, slice

exports.define = {
  reduce: function reduce (fn, start) {
    var this$1 = this;

    return (getKeys(this) || []).map(function (key) { return get(this$1, key); }).reduce(fn, start)
  },
  map: function map (fn, callee) {
    var this$1 = this;

    return (getKeys(this) || []).map(function (val, key, array) { return fn(get(this$1, val), key, array); })
  },
  filter: function filter (fn) {
    var this$1 = this;

    return (getKeys(this) || []).map(function (key) { return get(this$1, key); }).filter(fn)
  },
  forEach: function forEach (fn) {
    var this$1 = this;

    var keys = getKeys(this)
    if (keys) {
      keys = keys.concat()  // bit slow but usefull for remove for example
      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i]
        var r = get(this$1, key)
        if (r) { fn(r, key, this$1) }
      }
    }
  }
}

},{"../get":54,"../keys":57}],60:[function(require,module,exports){
var ms = require('monotonic-timestamp')
var ref = require('../compute');
var compute = ref.compute;
var origin = ref.origin;
var ref$1 = require('../traversal');
var parent = ref$1.parent;
var root = ref$1.root;
var path = ref$1.path;
var ref$2 = require('../manipulate');
var create = ref$2.create;
var set = ref$2.set;
var ref$3 = require('../keys');
var getKeys = ref$3.getKeys;
var ref$4 = require('../emit');
var generic = ref$4.generic;
var ref$5 = require('../context');
var applyContext = ref$5.applyContext;
var storeContext = ref$5.storeContext;
var once = require('../once')
var getApi = require('../get/api')
var bs = require('brisky-stamp')
var ref$6 = require('../subscribe');
var subscribe = ref$6.subscribe;
var parse = ref$6.parse;
var uid = require('../uid')

var chain = function (c, t) { return c === null || c && c !== true ? c : t; }
var serialize = require('../serialize')

exports.inject = [
  require('./functional'),
  require('./iterator')
  // require('../debug')
]

var listenerId = 0
exports.define = {
  uid: function uid$1 () { return uid(this) },
  applyContext: function applyContext$1 (context) { return applyContext(this, context) },
  storeContext: function storeContext$1 () { return storeContext(this) },
  serialize: function serialize$1 (fn) { return serialize(this, fn) },
  root: function root$1 () { return root(this) },
  path: function path$1 () { return path(this) },
  parent: function parent$1 (fn) {
    if (fn !== void 0) {
      if (typeof fn === 'function') {
        var p = this
        while (p) {
          var result = fn(p)
          if (result) { return result }
          p = parent(p)
        }
      } else {
        var p$1 = this
        while (fn-- && p$1) { p$1 = parent(p$1) }
        return p$1
      }
    } else {
      return parent(this)
    }
  },
  emit: function emit (type, val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      generic(this, type, val, stamp)
      bs.close(stamp)
    } else {
      generic(this, type, val, stamp)
    }
    return this
  },
  subscribe: function subscribe$1 (subs, cb, raw) {
    return subscribe(this, !raw ? parse(subs) : subs, cb)
  },
  once: function once$1 (check, callback) { return once(this, check, callback) },
  on: function on (type, val, id) {
    if (typeof type === 'function') {
      val = type
      type = 'data'
    }
    if (!id) { id = ++listenerId }
    var temp = { on: {} } // problem with buble cant set [type] : { [id] }
    var obj;
    temp.on[type] = ( obj = {}, obj[id] = val, obj )
    return chain(set(this, temp), this)
  },
  set: function set$1 (val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      var ret = chain(set(this, val, stamp), this)
      bs.close(stamp)
      return ret
    } else {
      return chain(set(this, val, stamp), this)
    }
  },
  create: function create$1 (val, stamp) {
    if (stamp === void 0) {
      stamp = bs.create()
      var ret = create(this, val, stamp)
      bs.close(stamp)
      return ret
    } else {
      return create(this, val, stamp)
    }
  },
  // add api as a mehtod perhaps?
  get: function get (key, val, stamp) { return getApi(this, key, val, stamp) },
  push: function push (val, stamp) {
    var key = ms()
    var obj;
    return chain(set(this, ( obj = {}, obj[key] = val, obj ), stamp), this)[key]
  },
  compute: function compute$1 (val) { return compute(this, val) },
  origin: function origin$1 () { return origin(this) },
  keys: function keys () { return getKeys(this) }
}

},{"../compute":50,"../context":51,"../emit":52,"../get/api":53,"../keys":57,"../manipulate":58,"../once":62,"../serialize":65,"../subscribe":73,"../traversal":79,"../uid":80,"./functional":59,"./iterator":61,"brisky-stamp":48,"monotonic-timestamp":81}],61:[function(require,module,exports){
var ref = require('../keys');
var getKeys = ref.getKeys;
var ref$1 = require('../get');
var get = ref$1.get;

module.exports = function (struct) {
  if (typeof Symbol !== 'undefined') {
    struct.Constructor.prototype[Symbol.iterator] = function () {
      var keys = getKeys(this)
      var t = this
      var i = 0
      return {
        throw: function () {},
        // add handle for removal / change of keys
        next: function () { return ({
          value: get(t, keys[i++]),
          done: i === keys.length + 1
        }); }
      }
    }
  }
}

},{"../get":54,"../keys":57}],62:[function(require,module,exports){
var ref = require('./manipulate');
var set = ref.set;
var ref$1 = require('./compute');
var compute = ref$1.compute;
var uid = 0

module.exports = function (t, check, callback) {
  var id = 'O' + ++uid
  if (!callback) {
    var promise
    if (check === void 0) {
      promise = new Promise(function (resolve) { return on(t, id, function (t, val, stamp) {
        resolve(t, val, stamp)
        return true
      }); })
    } else {
      promise = new Promise(function (resolve) {
        if (!evaluate(resolve, check, t)) {
          on(t, id, function (val, stamp, t) { return evaluate(resolve, check, t, val, stamp); })
        }
      })
    }
    return promise
  } else {
    if (check === void 0) {
      on(t, id, function (val, stamp, t) {
        callback(val, stamp, t)
        return true
      })
    } else {
      if (!evaluate(callback, check, t)) {
        on(t, id, function (val, stamp, t) { return evaluate(callback, check, t, val, stamp); })
      }
    }
    return id
  }
}

var evaluate = function (resolve, check, t, val, stamp) {
  if (typeof check === 'function'
      ? check(t, val, stamp)
      : compute(t) == check //eslint-disable-line
    ) {
    resolve(val, stamp, t)
    return true
  }
}

var on = function (t, id, listener) {
  var obj;
  var context = set(t, {
    on: {
      data: ( obj = {}, obj[id] = function (val, stamp, t) {
        if (listener(val, stamp, t)) {
          var obj;
            set(t, { on: { data: ( obj = {}, obj[id] = null, obj ) } })
        }
      }, obj )
    }
  })
  if (context && context.inherits) { t = context }
  return t
}

},{"./compute":50,"./manipulate":58}],63:[function(require,module,exports){
var ref = require('./get');
var get = ref.get;
var ref$1 = require('./keys');
var addKey = ref$1.addKey;
var ref$2 = require('./manipulate');
var create = ref$2.create;
var set = ref$2.set;
var ref$3 = require('./context');
var contextProperty = ref$3.contextProperty;

var property = function (t, val, key, stamp, struct) {
  var changed
  var result = get(t, key)
  if (result && result.inherits) {
    if (result.context) {
      contextProperty(t, val, stamp, key, result)
    } else {
      set(result, val, stamp)
      changed = val === null
    }
  } else {
    changed = true
    addKey(t, key)
    create(struct, val, stamp, t, key)
  }
  return changed
}

var getProp = function (t, key) { return t.props
  ? key in t.props && t.props[key] || t.props.default
  : getProp(t.inherits, key); }

exports.getProp = getProp
exports.property = property

},{"./context":51,"./get":54,"./keys":57,"./manipulate":58}],64:[function(require,module,exports){
var ref = require('./get');
var get = ref.get;
var getFn = ref.getFn;
var ref$1 = require('./keys');
var removeKey = ref$1.removeKey;
var getKeys = ref$1.getKeys;
var ref$2 = require('./emit');
var data = ref$2.data;
var onData = ref$2.onData;
var ref$3 = require('./struct/listener');
var listener = ref$3.listener;
var uid = require('./uid')

var remove = module.exports = function (t, stamp, instance, from) {
  if (t._async) { delete t._async }

  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }

  if (!instance && t.inherits.instances) {
    var instances$1 = t.inherits.instances
    var i = instances$1.length
    while (i--) {
      if (instances$1[i] === t) { instances$1.splice(i, 1) }
    }
  }

  var instances = t.instances
  if (instances) {
    var i$1 = instances.length
    while (i$1--) { remove(instances[i$1], stamp, true) }
    t.instances = null
  }

  // remove struct emitters
  if (t.emitters && t.emitters.data && t.emitters.data.struct) {
    var s = t.emitters.data.struct.length
    while (s--) { t.emitters.data.struct[s].val = null }
  }

  if (stamp) {
    data(t, null, stamp)
    if (t._ks) {
      var keys = t._ks
      for (var i$2 = 0, len = keys.length; i$2 < len; i$2++) {
        if (keys[i$2] in t) {
          remove(t[keys[i$2]], stamp, false, true)
          i$2--
          len--
        } else {
          removeContext(t, keys[i$2], stamp)
        }
      }
    } else {
      var keys$1 = getKeys(t)
      if (keys$1) {
        for (var i$3 = 0, len$1 = keys$1.length; i$3 < len$1; i$3++) {
          removeContext(t, keys$1[i$3], stamp)
        }
      }
    }
  } else if (t._ks) {
    var keys$2 = t._ks
    for (var i$4 = 0, len$2 = keys$2.length; i$4 < len$2; i$4++) {
      if (keys$2[i$4] in t) {
        remove(t[keys$2[i$4]], stamp, false, true)
        i$4--
        len$2--
      }
    }
  }

  removeFromParent(t._p, t.key, stamp, false, from)
}

var removeFromParent = function (parent, key, stamp, instance, from) {
  if (parent && key) {
    if (!instance || parent._ks) {
      removeKey(parent, key)
      if (instance) {
        if (key in parent) { delete parent[key] }
      } else {
        parent[key] = null
      }
    }
    if (!from && stamp) { data(parent, null, stamp) }
    var instances = parent.instances
    if (instances) {
      var i = instances.length
      while (i--) {
        removeFromParent(instances[i], key, stamp, true)
      }
    }
  }
}

var removeContext = function (context, key, stamp) {
  var t = get(context, key)
  if (t) {
    var emitter = onData(t)
    if (emitter) {
      var listeners = getFn(emitter)
      if (listeners) {
        var i = listeners.length
        while (i--) { listeners[i](null, stamp, t) }
      }
    }
    var keys = getKeys(t)
    if (keys) {
      for (var i$1 = 0, len = keys.length; i$1 < len; i$1++) {
        removeContext(t, keys[i$1], stamp)
      }
    }
    t.context = null
    t.contextLevel = null
  }
}

},{"./emit":52,"./get":54,"./keys":57,"./struct/listener":68,"./uid":80}],65:[function(require,module,exports){
var ref = require('./get');
var get = ref.get;
var ref$1 = require('./keys');
var getKeys = ref$1.getKeys;
var ref$2 = require('./traversal');
var path = ref$2.path;
var getVal = function (t) { return t.val !== void 0 ? t.val : t.inherits && getVal(t.inherits); }

var serialize = function (t, fn) {
  var result = {}
  var val = getVal(t)
  var keys = getKeys(t)
  if (val && typeof val === 'object' && val.inherits) {
    var p = path(val) // memoized paths later
    val = [ '@' ]
    var i = p.length
    while (i--) { val[i + 1] = p[i] }
  }
  if (keys) {
    for (var i$1 = 0, len = keys.length; i$1 < len; i$1++) {
      var key = keys[i$1]
      var keyResult = serialize(get(t, key), fn)
      if (keyResult !== void 0) { result[key] = keyResult }
    }
    if (val !== void 0) { result.val = val }
  } else if (val !== void 0) {
    result = val
  }
  return fn ? fn(t, result) : result
}

module.exports = serialize

},{"./get":54,"./keys":57,"./traversal":79}],66:[function(require,module,exports){
var ref = require('../manipulate');
var create = ref.create;
var set = ref.set;
var ref$1 = require('../property');
var property = ref$1.property;
var ref$2 = require('./types');
var types = ref$2.types;
var type = ref$2.type;
var ref$3 = require('../get');
var getDefault = ref$3.getDefault;
var inject = require('./inject')
var CONSTRUCTOR = 'Constructor'
var struct = {}

var getProps = function (t) { return t.props || getProps(t.inherits); }

var props = {
  types: types,
  type: type,
  inject: inject,
  async: function (t, val) {
    if (t.async && !val) { delete t.async }
  },
  key: function (t, val) { t.key = val },
  instances: function (t, val) { t.instances = val },
  $transform: function (t, val) { t.$transform = val },
  reset: function (t, val, stamp) {
    t.forEach(val === true
      ? function (p) { return p.set(null, stamp); }
      : function (p, key) { return val.indexOf(key) === -1 && p.set(null, stamp); }
    )
  },
  props: function (t, val, key, stamp) {
    var props = t.props
    if (!props) {
      var previous = getProps(t)
      props = t.props = {}
      if (previous) {
        for (var key$1 in previous) {
          props[key$1] = previous[key$1]
        }
      }
    }
    for (var key$2 in val) {
      parse(t, val[key$2], key$2, stamp, props)
    }
  }
}

var simple = function (t, val, key) { t[key] = val }

var notSelf = function (t, key, struct) { return t.props &&
  t.props[key] && t.props[key].struct === struct ||
  t.inherits && notSelf(t.inherits, key, struct); }

var parse = function (t, val, key, stamp, props) {
  if (val === true) {
    props[key] = simple
  } else if (val === null) {
    if (props[key]) { delete props[key] }
  } else if (typeof val !== 'function') {
    var struct
    if (typeof val === 'object' && val.inherits) {
      struct = val
    } else if (val === 'self') {
      struct = t
    } else {
      var inherit = props[key] && props[key].struct
      if (inherit) {
        if (notSelf(t.inherits, key, inherit)) {
          struct = create(inherit, val, void 0, t)
        } else {
          set(inherit, val)
          return
        }
      } else {
        struct = create(getDefault(t), val, void 0, t)
      }
    }
    var definition = function (t, val, key, stamp) { return property(t, val, key, stamp, struct); }
    definition.struct = struct
    props[key] = definition
  } else {
    props[key] = val
  }
}

var define = function (t, value, key) {
  Object.defineProperty(t, key, { configurable: true, value: value })
  return t
}

var createConstructor = function (t, Inherit) {
  function Struct () {}
  if (Inherit) { Struct.prototype = new Inherit() }
  define(Struct.prototype, Struct, CONSTRUCTOR)
  define(t, Struct, CONSTRUCTOR)
  return Struct
}

struct.instances = false
struct.props = props
struct.types = { struct: struct }

createConstructor(struct)
struct.props.define = function (t, val) {
  var proto
  if (!t.hasOwnProperty(CONSTRUCTOR)) {
    createConstructor(t, t.Constructor)
  }
  proto = t.Constructor.prototype
  for (var key in val) { define(t, val[key], key) }
  for (var key$1 in val) { define(proto, val[key$1], key$1) }
}

props.default = function (t, val, key, stamp) { return property(t, val, key, stamp, struct); }
props.default.struct = struct

require('./on')(struct)

module.exports = struct

},{"../get":54,"../manipulate":58,"../property":63,"./inject":67,"./on":69,"./types":70}],67:[function(require,module,exports){
var ref = require('../manipulate');
var set = ref.set;

var inject = function (t, val, stamp) { return typeof val === 'function'
  ? val(t, val, stamp)
  : set(t, val, stamp); }

module.exports = function (t, val, key, stamp) {
  var changed
  if (Array.isArray(val)) {
    for (var i = 0, len = val.length; i < len; i++) {
      if (inject(t, val[i], stamp)) {
        changed = true
      }
    }
  } else {
    changed = inject(t, val, stamp)
  }
  return changed
}

},{"../manipulate":58}],68:[function(require,module,exports){
var ref = require('../get');
var getFn = ref.getFn;
var get = function (t, key) { return t[key] || t.inherits && get(t.inherits, key); }

var listener = function (t, val, key, stamp) {
  if (key in t) {
    var result = t[key]
    if (result) {
      if (result !== val) {
        var isFn = typeof result === 'function'
        replace(isFn ? t.fn : t.struct, result, val)
        if (val === null) {
          delete t[key]
        } else {
          t[key] = val
        }
      }
    } else {
      add(t, val, key)
    }
  } else {
    var result$1 = get(t.inherits, key)
    if (result$1 && typeof result$1 === 'function') {
      if (result$1 !== val) {
        if (t.fn) {
          replace(t.fn, result$1, val)
        } else {
          t.fn = copyContext(getFn(t), result$1, val)
        }
        t[key] = val
      }
    } else {
      add(t, val, key)
    }
  }
}

var add = function (t, val, key) {
  if (typeof val === 'function') {
    addFn(t, val)
  } else {
    addStruct(t, val)
  }
  t[key] = val
}

var copyContext = function (arr, val, replacement) {
  var b = []
  if (!replacement) {
    for (var i = 0, j = 0, len = arr.length; i < len; i++) {
      if (arr[i] === val) {
        j = 1
      } else {
        b[i - j] = arr[i]
      }
    }
  } else {
    var i$1 = arr.length
    while (i$1--) {
      if (arr[i$1] === val) {
        b[i$1] = replacement
      } else {
        b[i$1] = arr[i$1]
      }
    }
  }
  return b
}

var replace = function (arr, val, replacement) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === val) {
      if (replacement) {
        arr.splice(i, 1, replacement)
      } else {
        arr.splice(i, 1)
      }
      break
    }
  }
}

var create = function (arr, val) {
  if (arr) {
    var i = arr.length
    var b = [ val ]
    while (i--) { b[i + 1] = arr[i] }
    return b
  } else {
    return [ val ]
  }
}

var addFn = function (t, val) {
  if (!t.fn) {
    t.fn = create(getFn(t), val)
  } else {
    t.fn.unshift(val)
  }
}

var addStruct = function (t, val) {
  if (!t.struct) {
    t.struct = [ val ]
  } else {
    t.struct.unshift(val)
  }
}

exports.addFn = addFn
exports.listener = listener
exports.replace = replace

},{"../get":54}],69:[function(require,module,exports){
module.exports = function (struct) {
  var ref = require('../property');
  var property = ref.property;
  var ref$1 = require('../manipulate');
  var create = ref$1.create;
  var set = ref$1.set;
  var ref$2 = require('./listener');
  var listener = ref$2.listener;
  var addFn = ref$2.addFn;
  var replace = ref$2.replace;

  var emitter = create(struct, {
    instances: false,
    props: { default: listener }
  })

  var update = function (t, val, key, original) {
    if (!(key in t)) {
      var field = val[key]
      if (!field || typeof field === 'function') {
        if (field === null) {
          replace(t.fn, original[key])
        } else {
          addFn(t, field)
        }
        return true
      }
    }
  }

  var instances = function (t, val, original, fields) {
    var i = t.instances.length
    while (i--) {
      var instance = t.instances[i]
      if (instance.fn) {
        if (!fields) { fields = Object.keys(val) }  // can use something else for perf
        var j = fields.length
        if (instance.instances) {
          var inherits
          while (j--) {
            var key = fields[j]
            if (update(instance, val, key, original)) {
              if (!inherits) {
                inherits = [ key ]
              } else {
                inherits.push(key)
              }
            }
          }
          if (inherits) { instances(instance, val, original, inherits) }
        } else {
          while (j--) { update(instance, val, fields[j], original) }
        }
      } else if (instance.instances) {
        instances(instance, val, original, fields)
      }
    }
  }

  var emitterProperty = function (t, val, key, stamp) {
    if (val && key in t && t.instances) {
      var field = t[key]
      if (field) { instances(field, val, field) }
    }
    return property(t, val, key, stamp, emitter)
  }
  emitterProperty.struct = emitter

  var getOn = function (t) { return t.emitters || t.inherits && getOn(t.inherits); }

  var onStruct = create(struct, {
    instances: false,
    props: {
      default: emitterProperty
    }
  })

  var on = function (t, val, key, stamp) {
    if (val) {
      if (typeof val === 'function') {
        val = { data: { _val: val } }
      } else {
        for (var key$1 in val) {
          var emitter = val[key$1]
          if (emitter) {
            if (typeof emitter === 'function') {
              val[key$1] = { _val: emitter }
            } else {
              if (emitter.val) {
                emitter._val = emitter.val
                delete emitter.val
              }
            }
          }
        }
      }
    }
    var result = getOn(t)
    if (result) {
      if (!t.emitters) {
        t.emitters = create(result, val, stamp, t, key)
      } else {
        set(result, val, stamp)
      }
    } else {
      t.emitters = create(onStruct, val, stamp, t, key)
    }
  }

  struct.props.on = on
  on.struct = onStruct
}

},{"../manipulate":58,"../property":63,"./listener":68}],70:[function(require,module,exports){
var ref = require('../manipulate');
var create = ref.create;
var ref$1 = require('../get');
var getDefault = ref$1.getDefault;

exports.types = function (t, val) {
  if (!t.types) { t.types = {} }
  for (var key in val) {
    var prop = val[key]
    if (typeof prop === 'object' && prop.inherits) {
      t.types[key] = prop
    } else {
      t.types[key] = create(getDefault(t), prop, void 0, t)
    }
  }
}

exports.type = function (t, val) {
  t.type = val
  // console.log('when not of the same type remove it', t.key, val)
}

var getType = function (parent, type, t) { return (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  ); }

exports.getType = getType

},{"../get":54,"../manipulate":58}],71:[function(require,module,exports){
var ref = require('./property');
var property = ref.property;
var ref$1 = require('../keys');
var getKeys = ref$1.getKeys;

var inherits = function (key, t, index) {
  var i = 0
  while (i < index && t && typeof t === 'object' && t.inherits) {
    i++
    if (key in t) {
      return false
    }
    t = t.val
  }
  return true
}

// reintroduce $m whenever it feels like its going to help
var parseKeys = function (t) {
  var keys = getKeys(t)
  var orig = t
  t = t.val
  if (t && typeof t === 'object' && t.inherits) {
    var combined
    var index = 1
    while (t && typeof t === 'object' && t.inherits) {
      var k = getKeys(t)
      var kl = k && k.length
      if (kl) {
        if (!combined) {
          if (keys) {
            combined = []
            for (var j = 0, len = keys.length; j < len; j++) {
              combined[j] = keys[j]
            }
            for (var i = 0; i < kl; i++) {
              if (inherits(k[i], orig, index)) {
                combined.push(k[i])
              }
            }
          } else {
            keys = k
          }
        } else {
          for (var i$1 = 0; i$1 < kl; i$1++) {
            if (inherits(k[i$1], orig, index)) {
              combined.push(k[i$1])
            }
          }
        }
      }
      index++
      t = t.val
    }
    return combined || keys
  }
  return keys
}

var any = function (t, subs, cb, tree, removed) {
  if (removed || !t) {
    if (tree.$any) {
      removeFields(t, subs, cb, tree)
      return true
    }
  } else {
    var keys = parseKeys(t)
    if (keys) {
      if (!tree.$any) {
        create(keys, t, subs, cb, tree)
        return true
      } else {
        return update(keys, t, subs, cb, tree)
      }
    } else if (tree.$any) {
      removeFields(t, subs, cb, tree)
      return true
    }
  }
}

module.exports = any

var removeFields = function (t, subs, cb, tree) {
  var branch = tree.$any
  var $keys = branch.$keys
  var len = $keys.length
  for (var i = 0; i < len; i++) {
    property($keys[i], t, subs, cb, branch, true)
  }
  delete tree.$any
}

var create = function (keys, t, subs, cb, tree) {
  var len = keys.length
  var $keys = new Array(len)
  var branch = tree.$any = { _p: tree, _key: '$any', $keys: $keys }
  for (var i = 0; i < len; i++) {
    var key = keys[i]
    $keys[i] = key
    property(key, t, subs, cb, branch)
  }
}

var modify = function (hot, $keys, t, subs, cb, branch) {
  for (var i = 0, len = hot.length; i < len - 2; i += 3) {
    var create = hot[i]
    var remove = hot[i + 1]
    if (remove) {
      property(remove, t, subs, cb, branch, true)
      $keys.pop() // measure speed of pop make this faster
    }
    if (create) {
      var index = hot[i + 2]
      property(create, t, subs, cb, branch)
      $keys[index] = create
    }
  }
}

var update = function (keys, t, subs, cb, tree) {
  var hot, changed
  var branch = tree.$any
  var $keys = branch.$keys
  var len1 = $keys.length
  var len2 = keys.length
  var checks = len1

  var len = len1 > len2 ? len1 : len2
  for (var i = 0; i < len; i++) {
    var key = keys[i]
    var compare = $keys[i]
    if (key === compare) {
      checks--
      changed = property(key, t, subs, cb, branch)
    } else {
      if (!hot) {
        hot = [ key, compare, i ]
      } else {
        if (checks) {
          var j = hot.length
          var block
          while (!block && (j -= 3) > -1) {
            if (key !== void 0 && hot[j + 1] === key) {
              $keys[i] = key
              changed = property(key, t, subs, cb, branch)
              if (compare === hot[j]) {
                if (compare && $keys[hot[j + 2]] !== compare) {
                  $keys[hot[j + 2]] = compare
                }
                hot.splice(j, 3)
                checks--
                block = true
              } else {
                hot[j + 1] = key = void 0
                if (hot[j] === void 0) {
                  hot.splice(j, 3) // splice is slow
                  checks--
                }
                if (compare === void 0) { block = true }
              }
            } else if (compare !== void 0 && compare === hot[j]) {
              var index = hot[j + 2]
              $keys[index] = compare
              changed = property(compare, t, subs, cb, branch)
              if (key === hot[j + 1]) {
                hot.splice(j, 3)
                checks--
                block = true
              } else {
                hot[j] = compare = void 0
                if (hot[j + 1] === void 0) {
                  hot.splice(j, 3)
                  checks--
                }
                if (key === void 0) { block = true }
              }
            }
          }
          if (!block) {
            hot.push(key, compare, i)
          } else {
            checks--
          }
        } else {
          hot.push(key, void 0, i)
        }
      }
    }
  }
  if (hot) {
    modify(hot, $keys, t, subs, cb, branch)
    changed = true
  }
  return changed
}

},{"../keys":57,"./property":75}],72:[function(require,module,exports){
var property, any, root, parent, $switch

//   if (diff(t, subs, cb, branch, tree, void 0, branch.$c)) {

var diff = function (t, subs, cb, tree, removed, composite) {
  var changed
  if (composite) {
    for (var key in composite) {
      if (key in tree) {
        var branch = tree[key]
        var c = branch.$c
        if (c) {
          if (key === '$any') {
            for (var k in c) {
              var y = branch[k].$c
              if (property(k, t, subs.$any, cb, branch, removed, y)) {
                changed = true
              }
            }
          } else if (parse(key, t, subs, cb, tree, removed, c)) {
            changed = true
          }
        } else {
          if (parse(key, t, subs, cb, tree, removed)) {
            changed = true
          }
        }
      }
    }
  } else {
    for (var key$1 in subs) {
      if (key$1 !== 'val' && key$1 !== 'props' && key$1 !== '_' && key$1 !== '$blockRemove') {
        if (parse(key$1, t, subs, cb, tree, removed, composite)) {
          changed = true
        }
      }
    }
  }
  return changed
}

var parse = function (key, t, subs, cb, tree, removed, composite) {
  if (key === 'root') {
    return root(t, subs.root, cb, tree, removed)
  } else if (key === 'parent') {
    return parent(t, subs.parent, cb, tree, removed)
  } else if (key[0] === '$') {
    if (key === '$any') {
      return any(t, subs.$any, cb, tree, removed, composite)
    } else if (key.indexOf('$switch') === 0) {
      return $switch(key, t, subs, cb, tree, removed, composite)
    }
  } else {
    return property(key, t, subs[key], cb, tree, removed, composite)
  }
}

exports.diff = diff
exports.parse = parse

property = require('./property').property
any = require('./any')
root = require('./root')
parent = require('./parent')
$switch = require('./switch')

},{"./any":71,"./parent":74,"./property":75,"./root":77,"./switch":78}],73:[function(require,module,exports){
var ref = require('./diff');
var diff = ref.diff;
var bs = require('brisky-stamp')

// add ref supports here -- use references field in prop or even simpler
var subscribe = function (t, subs, cb, tree) {
  var inProgress

  var listen = function (t, fn) { return t.subscriptions.push(function () {
    if (!inProgress) {
      inProgress = true
      bs.on(function () {
        inProgress = false
        fn()
      })
    }
  }); }

  if (!t.subscriptions) { t.subscriptions = [] }
  if (!tree) { tree = {} }

  if (subs.val) {
    if (subs.val === true) {
      listen(t, function () {
        cb(t, 'update', subs, tree)
        diff(t, subs, cb, tree)
      })
    } else {
      listen(t, function () { return diff(t, subs, cb, tree); })
    }
    cb(t, 'new', subs, tree)
  } else {
    listen(t, function () { return diff(t, subs, cb, tree); })
  }
  diff(t, subs, cb, tree)
  return tree
}

var parse = function (subs) {
  if (subs) {
    if (subs === true) {
      return { val: true }
    }
    var result = {}
    for (var key in subs) {
      var sub = subs[key]
      if (key === 'val' || key === '_') {
        result[key] = sub
      } else {
        var type = typeof sub
        if (type === 'object') {
          result[key] = parse(sub)
        } else if (type === 'function') {
          result[key] = sub
        } else {
          result[key] = { val: sub }
        }
      }
    }
    return result
  }
}

exports.subscribe = subscribe
exports.parse = parse

},{"./diff":72,"brisky-stamp":48}],74:[function(require,module,exports){
var ref = require('./diff');
var diff = ref.diff;
var ref$1 = require('../traversal');
var root = ref$1.root;
var ref$2 = require('../get');
var getOrigin = ref$2.getOrigin;

module.exports = function (t, subs, cb, tree, removed) {
  var branch = tree.parent
  if (!removed && t) {
    if (!branch) {
      branch = tree.parent = { _p: tree, _key: 'parent' }
      composite(tree)
    }
    return diff(getParent(t, tree), subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

var get = function (t, path) {
  var i = path.length
  while (i--) {
    if (path[i] === 'root') {
      t = root(t)
    } else {
      t = getOrigin(t, path[i])
    }
  }
  return t
}

var getParent = function (t, tree) {
  var path = []
  var cnt = 1
  var i = 0
  while (tree) {
    if (tree._key && tree._key[0] !== '$') {
      if (tree._key === 'parent') {
        cnt++
      } else {
        if (cnt) {
          cnt--
        } else {
          path[i++] = tree._key
        }
      }
    }
    tree = tree._p
  }
  return get(root(t), path)
}

var composite = function (tree) {
  var key = 'parent'
  var parentcounter = 1
  while (tree._p && parentcounter) {
    var tkey = tree._key
    if (tkey !== 'parent') {
      if (parentcounter === 1 && tkey !== 'root') { // && tkey !== '$any'
        if (!tree.$c) { tree.$c = {} }
        if (!(key in tree.$c) || tree.$c[key] !== 'root') {
          tree.$c[key] = 'parent'
        }
      }
      key = tkey
      tree = tree._p
      if (key[0] !== '$') {
        parentcounter--
      }
    } else {
      parentcounter++
      tree = tree._p
    }
  }
}

},{"../get":54,"../traversal":79,"./diff":72}],75:[function(require,module,exports){
var ref = require('../diff');
var diff = ref.diff;
var remove = require('./remove')
var ref$1 = require('../../get');
var getOrigin = ref$1.getOrigin;

var update = function (key, t, subs, cb, tree, c) {
  var branch = tree[key]
  var changed
  if (t) {
    var stamp = t.tStamp || 0 // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$ !== stamp || branch.$t !== t) {
      branch.$t = t
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$c) {
      if (diff(t, subs, cb, branch, void 0, branch.$c)) {
        changed = true // cover this
      }
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

var property = function (key, t, subs, cb, tree, removed, composite) {
  var changed
  if (removed) {
    var branch = tree[key]
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    t = getOrigin(t, key)
    // if (t) {
    changed = update(
      key,
      t,
      subs,
      cb,
      tree,
      composite
    )
    // }
  }
  return changed
}

exports.property = property
exports.update = update

},{"../../get":54,"../diff":72,"./remove":76}],76:[function(require,module,exports){
var ref = require('../diff');
var diff = ref.diff;

var remove = function (subs, cb, tree) {
  var t = tree.$t
  if (subs.val) { cb(t, 'remove', subs, tree) }
  if (!subs.$blockRemove) {
    diff(t, subs, cb, tree, true)
  }
  var key = tree._key
  if (tree.$c) { composite(tree._p, key) }
  delete tree._p[key]
}

var empty = function (obj) {
  for (var key in obj) {
    return false
  }
  return true
}

var composite = function (tree, key) {
  var rootClear
  while (tree) {
    if (tree.$c) {
      if (tree.$c[key]) {
        if (tree.$c[key] === 'root') { rootClear = true }
        delete tree.$c[key]
        if (empty(tree.$c)) {
          delete tree.$c
          key = tree._key
          tree = tree._p
        } else {
          if (rootClear) {
            var block
            for (var i in tree.$c) {
              if (tree.$c[i] === 'root') {
                block = true
                break
              }
            }
            if (!block) { clearRootComposite(tree) }
          }
          break
        }
      }
    } else {
      if (rootClear && tree._key === 'parent') {
        clearRootComposite(tree)
      }
      break
    }
  }
}

var clearRootComposite = function (tree) {
  tree = tree._p
  var key = 'parent'
  var cnt = 0
  while (tree) {
    if (key === 'root') {
      break
    } else {
      if (key === 'parent') {
        cnt++
      } else if (key[0] !== '$') {
        cnt--
      }
      if (tree.$c && tree.$c[key]) {
        if (cnt > 0) {
          tree.$c[key] = 'parent'
          for (var i in tree.$c) {
            if (i !== key) {
              if (tree.$c[i] === 'root') {
                tree = false
              }
            }
          }
          if (tree) {
            key = tree._key
            tree = tree._p
          }
        } else {
          delete tree.$c[key]
          if (empty(tree.$c)) {
            delete tree.$c
            key = tree._key
            tree = tree._p
          } else {
            break
          }
        }
      } else {
        key = tree._key
        tree = tree._p
      }
    }
  }
}

module.exports = remove

},{"../diff":72}],77:[function(require,module,exports){
var ref = require('./diff');
var diff = ref.diff;
var ref$1 = require('../traversal');
var root = ref$1.root;

module.exports = function (t, subs, cb, tree, removed) {
  var branch = tree.root
  if (t && !removed) {
    if (!branch) {
      branch = tree.root = { _key: 'root', _p: tree }
      composite(tree)
    }
    return diff(root(t), subs, cb, branch)
  } else if (branch) {
    diff(branch.$t, subs, cb, branch, true)
    return true
  }
}

var composite = function (tree) {
  var key = 'root'
  while (
    tree._p &&
    (!(tree.$c) ||
    !(key in tree.$c) ||
    tree.$c[key] !== 'root')
  ) {
    var tkey = tree._key
    if (tkey !== 'parent' && tkey !== 'root') { // && tkey !== '$any'
      if (!('$c' in tree)) { tree.$c = {} }
      tree.$c[key] = 'root'
    }
    key = tkey
    tree = tree._p
  }
}

},{"../traversal":79,"./diff":72}],78:[function(require,module,exports){
var ref = require('./diff');
var diff = ref.diff;
var remove = require('./property/remove')
var ref$1 = require('./property');
var update = ref$1.update;
var ref$2 = require('../compute');
var origin = ref$2.origin;

var driver = function (t, type) {}

var driverChange = function (key, tkey, t, subs, cb, tree, removed, composite) {
  var branch = tree[key]
  if (diff(t, subs, driver, branch, removed, composite)) {
    return body(tkey, t, subs, cb, tree, removed, subs.val, false, composite)
  }
}

var $switch = function (key, t, subs, cb, tree, removed, composite) {
  var $switch = subs[key]
  if (!$switch) {
    var tkey = key.slice(0, -1) // this means from composite
    driverChange(key, tkey, t, subs[tkey], cb, tree, removed, composite)
  } else {
    if ($switch.val) {
      var dKey = key + '*'
      var driverBranch = tree[dKey]
      if (driverBranch) {
        if (diff(t, $switch, driver, driverBranch, removed, composite)) {
          return body(key, t, subs, cb, tree, removed, $switch.val, true, composite)
        } else {
          var branch = tree[key]
          if (branch) { update(key, t, branch.$subs, cb, tree, removed, composite) }
        }
      } else if (!driverBranch) {
        create(dKey, t, $switch, driver, tree, composite)
        return body(key, t, subs, cb, tree, removed, $switch.val, true, composite)
      }
    } else {
      return body(key, t, subs, cb, tree, removed, $switch, true, composite)
    }
  }
}

var create = function (key, t, subs, cb, tree, composite) {
  var branch = tree[key] = {
    _p: tree,
    _key: key,
    $subs: subs
  }
  return diff(t, subs, cb, branch, void 0, composite)
}

var body = function (key, t, subs, cb, tree, removed, $switch, diffit, composite) {
  var result
  if (!removed && t) { result = $switch(t, subs, tree, key) }
  var branch = tree[key]
  if (!result) {
    if (branch) {
      remove(branch.$subs, cb, branch)
      return true
    }
  } else {
    if (!branch) {
      update(key, t, result, cb, tree, void 0, composite)
      branch = tree[key]
      branch.$subs = result
      branch.$origin = origin(t)
      return true
    } else if (isSwitched(branch.$subs, result, branch, t)) {
      remove(branch.$subs, cb, branch)
      update(key, t, result, cb, tree, void 0, composite)
      branch = tree[key]
      branch.$subs = result
      branch.$origin = origin(t)
      return true
    } else if (diffit) {
      return update(key, t, result, cb, tree, removed, composite)
    }
  }
}

var isSwitched = function (a, b, branch, t) {
  if (t) {
    var o = origin(t)
    // console.log(branch)
    var b$1 = branch.$origin
    // console.log(o.path(), b.path())
    if (b$1 !== o) {
      branch.$origin = o
      return true
    }
  }

  if (a === b) {
    return false // test
  } else {
    if (a._) {
      return a._ !== b._
    }
    for (var key in a) {
      if (a[key] !== b[key]) {
        if (typeof a[key] === 'function' && typeof b[key] === 'function') {
          if (a[key].toString() !== b[key].toString()) {
            return true
          }
        } else if (typeof a[key] !== 'object' || typeof b[key] !== 'object' || isSwitched(a[key], b[key])) {
          return true
        }
      }
    }
    for (var key$1 in b) {
      if (key$1 !== 'props' && !a[key$1]) { return true }
    }
  }
}

module.exports = $switch

},{"../compute":50,"./diff":72,"./property":75,"./property/remove":76}],79:[function(require,module,exports){
// will combined lookup
var parent = function (t) {
  if (t.context) {
    if (t.contextLevel === 1) {
      return t.context
    } else {
      t._p.contextLevel = t.contextLevel - 1
      t._p.context = t.context
      return t._p
    }
  } else {
    return t._p
  }
}

var root = function (t) {
  var p = t
  while (p) {
    t = p
    p = parent(p)
  }
  return t
}

var path = function (t) {
  var result = []
  var parent = t
  while (parent) {
    if (parent.context) {
      var i = parent.contextLevel
      var p = parent
      while (i--) {
        result.unshift(p.key)
        p = p._p
      }
      parent = parent.context
    } else if (parent.key) {
      result.unshift(parent.key)
      parent = parent._p
    } else {
      break
    }
  }
  return result
}

exports.path = path
exports.parent = parent
exports.root = root

},{}],80:[function(require,module,exports){
var cnt = 1e4 // so now a limition becomes 10k fns normal
var uid = function (t) { return t._uid || (t._uid = ++cnt) }
module.exports = uid

},{}],81:[function(require,module,exports){
// If `Date.now()` is invoked twice quickly, it's possible to get two
// identical time stamps. To avoid generation duplications, subsequent
// calls are manually ordered to force uniqueness.

var _last = 0
var _count = 1
var adjusted = 0
var _adjusted = 0

module.exports =
function timestamp() {
  /**
  Returns NOT an accurate representation of the current time.
  Since js only measures time as ms, if you call `Date.now()`
  twice quickly, it's possible to get two identical time stamps.
  This function guarantees unique but maybe inaccurate results
  on each call.
  **/
  //uncomment this wen
  var time = Date.now()
  //time = ~~ (time / 1000) 
  //^^^uncomment when testing...

  /**
  If time returned is same as in last call, adjust it by
  adding a number based on the counter. 
  Counter is incremented so that next call get's adjusted properly.
  Because floats have restricted precision, 
  may need to step past some values...
  **/
  if (_last === time)  {
    do {
      adjusted = time + ((_count++) / (_count + 999))
    } while (adjusted === _adjusted)
    _adjusted = adjusted
  }
  // If last time was different reset timer back to `1`.
  else {
    _count = 1
    adjusted = time
  }
  _adjusted = adjusted
  _last = time
  return adjusted
}

},{}],82:[function(require,module,exports){
/**
 * @function ua
 * Returns an object representing the user agent including data such as browser, device and platform
 * @param {string} _ua - the raw user agent string to be converted
 * @param {string} obj - (optional) object to be merged to the output result
 * @returns {object} object representing your user agent
 */
module.exports = exports = function (_ua, obj) {
  if (typeof _ua === 'string') {
    _ua = _ua.toLowerCase()
  } else {
    _ua = ''
  }
  if (obj === true) {
    obj = exports
  } else if (!obj) {
    obj = {}
  }
  // _ua = 'webos; linux - large screen'
  var _ff = 'firefox'
  var _mac = 'mac'
  var _chrome = 'chrome'
  var _android = 'android'
  var _wrapper = 'wrapper'
  var _mobile = '.+mobile'
  var _webkit = 'webkit'
  var _ps = 'playstation'
  var _xbox = 'xbox'
  var _linux = 'linux'
  var _castDetect = 'crkey'
  var _chromecast = 'cast'
  var _tablet = 'tablet'
  var _windows = 'windows'
  var _phone = 'phone'
  var _firetv = 'firetv'
  var _rikstv = 'rikstv'
  var _facebook = 'facebook'
  var _edge = 'edge'
  var _version = 'version'
  var _samsung = 'samsung'

  /**
   * browser detection
   */
  test.call(obj, _ua,
    function (query, arr) {
      obj.browser = arr[ 2 ] || query
      var _v = _ua.match(
        new RegExp('((([\\/ ]' + _version + '|' + arr[ 0 ] + '(?!.+' + _version + '))[\/ ])| rv:)([0-9]{1,4}\\.[0-9]{0,2})')
      )
      obj[_version] = _v ? Number(_v[4]) : 0
      obj.prefix = arr[1]
      // TODO: add prefix for opera v>12.15;
      // TODO: windows check for ie 11 may be too general;
    },
    [ true, _webkit ],
    [ '\\(' + _windows, 'ms', 'ie' ],
    [ 'safari', _webkit ],
    [ _ff, 'Moz' ],
    [ 'opera', 'O' ],
    [ 'msie', 'ms', 'ie' ],
    [ _facebook ],
    [ _chrome + '|crios\/', _webkit, _chrome ],
    [ _edge, _webkit, _edge ]
  )

  /**
   * platform detection
   */
  test.call(obj, _ua, 'platform',
    [ true, _windows ],
    [ _linux ],
    [ 'lg.{0,3}netcast', 'lg' ], // TODO:propably need to add more!
    [ _ff + _mobile, _ff ],
    [ _mac + ' os x', _mac ], [ 'iphone|ipod|ipad', 'ios' ],
    [ _xbox ],
    [ _ps ],
    [ _android ],
    [ _windows ],
    [ _castDetect, _chromecast ],
    [ 'smart-tv;|;' + _samsung + ';smarttv', _samsung ], // SmartTV2013
    [ _rikstv ]
  )

  /**
   * device detection
   */
  test.call(obj, _ua, 'device',
    [ true, 'desktop' ],
    [ _windows + '.+touch|ipad|' + _android, _tablet ],
    [
      _phone + '|phone|(' +
      _android + _mobile + ')|(' + _ff + _mobile +
      ')|' + _windows + ' phone|iemobile', _phone
    ],
    [ _xbox + '|' + _ps, 'console' ],
    [ 'tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv|webos.+large', 'tv' ],
    [ _castDetect, _chromecast ],
    [ _tablet + '|amazon-fireos|nexus (?=[^1-6])\\d{1,2}', _tablet ],
    [ 'aft[bsm]', _firetv ],
    [ _rikstv ]
  )

  /**
   * wrapped webview native app detection
   */
  test.call(obj, _ua, 'webview',
    [ true, false ],
    [  'crosswalk' ],
    [ 'vigour-' + _wrapper, _wrapper ],
    [ 'cordova' ],
    [ 'ploy-native' ]
  )

  return obj

  /**
   * test
   * search for regexps in the userAgent
   * fn is a on succes callback
   * check tests in https://github.com/faisalman/ua-parser-js to test for userAgents
   * @method
   */
  function test (_ua, fn) {
    for (
      var tests = arguments, i = tests.length - 1, t = tests[i], query = t[0];
      query !== true && !new RegExp(query).test(_ua) && i > 0;
      t = tests[--i], query = t[0]
    ); //eslint-disable-line
    // this for has no body
    if (fn.slice || fn.call(this, query, t)) {
      this[fn] = t[1] === void 0 ? query : t[1]
    }
  }
}

},{}],83:[function(require,module,exports){
'use strict'
var ua = require('./')
if (typeof window === 'undefined') {
  ua.platform = 'node'
} else {
  ua(window.navigator.userAgent, exports)
}

},{"./":82}],84:[function(require,module,exports){
module.exports = function (state, n) {
  if (!n) { n = 100 }
  var cnt = 0
  var update = function () {
    var i = n
    cnt++
    if (cnt > n) {
      cnt = 0
    }
    // var d = Date.now()
    var arr = []
    // arr[cnt] = 'ha' + cnt
    // arr[cnt + 100] = 'ha' + cnt
    // if (cnt === 1) {
    while (i--) { arr.push(i + cnt) }
    // }
    state.set({ collection: arr })
    // console.log(`n = ${n}`, Date.now() - d, 'ms')
    // global.requestAnimationFrame(update)
  }
  update()
}

},{}]},{},[1]);
