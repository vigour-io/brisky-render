import struct from 'brisky-struct'
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

const element = struct({
  type: 'element',
  types: {
    property
  },
  instances: false,
  define: { isElement: true }, // unnesecary code
  props: {
    tag: true,
    default: 'self'
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

element.set({ types: { element } }, false)

export default element
