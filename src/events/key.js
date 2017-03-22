import { struct } from 'brisky-struct'

const emitterProperty = struct.props.on.struct.props.default

const props = {
  tab: [ 9, 'Tab', 'U+0009' ],
  enter: [ 13, 'Enter' ],
  escape: [ 27, 'Escape', 'Cancel', 'U+001B' ],
  space: [ 32, 'Space', 'U+0020' ],
  arrowleft: [ 37, 'ArrowLeft', 'Left' ],
  arrowup: [ 38, 'ArrowUp', 'Up' ],
  arrowright: [ 39, 'ArrowRight', 'Right' ],
  arrowdown: [ 40, 'ArrowDown', 'Down' ],
  back: [ 8, 461, 'XF86Back', 'Backspace' ],
  select: [ 'Select' ]
}

for (let key in props) {
  const ids = new RegExp(`(^${props[key].join('$|^')}$)`)
  props[key] = (t, val) => {
    t.set({
      keydown: {
        [key] (e, stamp, elem) {
          if (
            ids.test(e.event.keyCode) ||
            ids.test(e.event.key) ||
            ids.test(e.event.keyIdentifier)
          ) {
            elem.emit(key, e, stamp)
          }
        }
      }
    })
    emitterProperty(t, val, key)
  }
}

export default { on: { props } }
