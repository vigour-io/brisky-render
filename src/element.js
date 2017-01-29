import { create } from 'brisky-struct'
import subscribe from './subscribe'
import findindex from './findindex'
import domElement from './render/dom/element'
import text from './property/text'
import html from './property/html'
import group from './property/group'
import attr from './property/attr'
import css from './property/class'
import style from './property/style'
import widget from './widget'
import events from './events'
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
    resolveNodes () {
      // find real inherits
      element._c = null
      element._cLevel = null
      element.set({ define: { resolve: true } })
    },
    removeUnresolved () {
      var d = Date.now()
      const elems = this.node.querySelectorAll('[id]')
      var i = elems.length
      // measure this function
      while (i--) {
        if (elems[i].id > 1e6) {
          elems[i].parentNode.removeChild(elems[i])
        }
      }
      element._c = null
      element._cLevel = null
      element.set({ define: { resolve: false } })
      console.log('RESOLVED', Date.now() - d, 'ms')
    }
  }, // unnesecary code
  props: {
    tag: true,
    resolveHash: true,
    default: 'self'
  },
  on: {
    resolve: (val, stamp, element) => {
      if (val) {
        element.resolveNodes()
      } else {
        element.removeUnresolved()
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
    style,
    widget,
    events
  ]
}, false)

element.set({
  props: {
    // with a subs ? not rly nessecary
    resolve: val => {
      console.log('lets go prerender!')
    }
  }
}, false)

export default element
