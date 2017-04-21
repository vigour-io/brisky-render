import { create, set } from 'brisky-struct'
import subscribe from './subscribe'
import findindex from './findindex'
import domElement from './render/dom/element'
import text from './property/text'
import html from './property/html'
import group from './property/group'
import attr from './property/attr'
import css from './property/class'
import scroll from './property/scroll'
import style from './property/style'
import widget from './widget'
import events from './events'
import keyevents from './events/key'
import property from './property'

const element = create({
  type: 'element',
  types: {
    property,
    element: 'self'
  },
  instances: false,
  define: {
    isElement: true,
    resolve: false,
    noResolve (val = true) {
      element._c = null
      element._cLevel = null
      element.set({ define: { _noResolve_: val } })
    },
    resolveNodes () {
      // find real inherits
      element._c = null
      element._cLevel = null
      element.set({ define: { resolve: true } })
    },
    removeUnresolved () {
      if (typeof window !== 'undefined') {
        console.log(`prerender disabbled...`)
        // setTimeout(() => {
        //   var d = Date.now()
        //   const elems = this.node.querySelectorAll('[id]')
        //   var i = elems.length
        //   var l = 0

        //   while (i--) {
        //     if ((elems[i].id | 0) > 1e6) {
        //       // let p = elems[i].parentNode
        //       // if (!p.id || !((p.id | 0) > 1e6)) {
        //         // console.error(elems[i].id)
        //       l++
        //         // elems[i].style.boxShadow = 'inset 0px 0px 20px red'
        //         // elems[i].style.height = '100px'
        //         // elems[i].style.width = '100px'
        //         // elems[i].style.backgroundColor = 'blue'
        //         // elems[i].style.zIndex = '1000'
        //         // elems[i].position = 'fixed'
        //       elems[i].parentNode.removeChild(elems[i])
        //       // }
        //     }
        //   }
        //   element._c = null
        //   element._cLevel = null
        //   element.set({ define: { resolve: false } })
        //   console.log(`REMOVE ${l} UN-RESOLVED`, Date.now() - d, 'ms')
        // })
      }
    }
  }, // unnesecary code
  props: {
    subscription: {
      type: 'property',
      render: { state () {}, static () {} }
    },
    resolveAttr: (t, val, key, stamp) => {
      var f = t
      var props
      while (!props && f) {
        props = f.props
        f = f.inherits
      }
      const set = {}
      for (let key in val) {
        if (key in props && key !== 'type') {
          set[key] = val[key]
        } else {
          if (!set.attr) set.attr = {}
          set.attr[key] = val[key]
        }
      }
      t.set(set, stamp)
    },
    tag: true,
    resolveHash: true,
    default: 'self'
  },
  on: {
    resolve: (val, stamp, element) => {
      if (val) {
        element.resolveNodes()
      } else {
        // element.removeUnresolved()
      }
    }
  },
  tag: 'div',
  inject: [
    subscribe,
    findindex,
    domElement,
    text,
    html,
    group,
    attr,
    css,
    scroll,
    style,
    widget,
    events,
    keyevents
  ]
}, false)

element.set({
  props: {
    resolve: val => {
      // console.log('lets go prerender!')
    }
  }
}, false)

set(element, {
  define: {
    set (val) {
      if (typeof window !== 'undefined') {
        // console.log('SET', this.path())
      }
      return set(this, val, false)
    }
  }
})

export default element
