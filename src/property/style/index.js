import parent from '../../render/dom/parent'
import ua from 'vigour-ua/navigator'
import { property } from '../../render/static'
import { sheet } from './sheet'
import transform from './transform'
import transformProp from './transform/property'

const inlineStyle = {
  type: 'property',
  props: { name: true },
  render: {
    static (target, node) {
      node.style[target.name || target.key] = target.compute()
    },
    state (t, s, type, subs, tree, id, pid) {
      if (type !== 'remove') {
        const node = parent(tree, pid)
        node.style[t.name || (t.key !== 'default' ? t.key : s.key)] = s
        ? t.compute(s, s)
        : t.compute()
      }
    }
  }
}

const style = {
  type: 'property',
  render: {
    static: property,
    state (t, s, type, subs, tree, id, pid) {
      if (type !== 'remove') {
        const pnode = parent(tree, pid)
        if (!pnode._styleStaticParsed) {
          property(t, pnode)
          pnode._styleStaticParsed = true
        }
      }
    }
  },
  props: {
    sheet,
    transform,
    inlineStyle: {
      type: 'inlineStyle'
    }
  },
  inject: [ t => {
    const inlineStyle = t.props.inlineStyle
    const props = {
      default (t, val, key, stamp) {
        if (val && val.$ || t.get([key, '$'])) {
          return inlineStyle(t, val, key, stamp)
        } else {
          t.set({ sheet: { [key]: val } }, stamp)
        }
      },
      appearance (t, val, key, stamp) {
        if (ua.prefix === 'moz') {
          key = 'mozAppearance'
        } else if (
          ua.prefix === 'webkit' ||
          ua.browser === 'ie' ||
          ua.browser === 'edge'
        ) {
          key = 'mozAppearance'
        }
        props.default(t, val, key, stamp)
      },
      filter (t, val, key, stamp) {
        if (ua.browser === 'chrome' || ua.browser === 'safari') {
          key = 'webkitFilter'
        }
        props.default(t, val, key, stamp)
      },
      flex (t, val, key, stamp) {
        if (ua.platform === 'ios' || ua.browser === 'safari') {
          key = 'webkitFlex'
        } else if (ua.browser === 'ie') {
          key = 'msFlex'
        }
        props.default(t, val, key, stamp)
      },
      order (t, val, key, stamp) {
        if (ua.browser === 'ie' && ua.version === 10) {
          key = 'msFlexOrder'
        }
        props.default(t, val, key, stamp)
      }
    }
    t.set({ props }, false)
  } ]
}

if (ua.browser === 'safari' || ua.platform === 'ios') {
  style.props.inlineDisplay = {
    type: 'inlineStyle',
    $transform: val => val === 'flex' ? '-webkit-flex' : val
  }
  style.inject.push(t => {
    const inlineDisplay = t.props.inlineDisplay
    t.set({
      props: {
        display (t, val, key, stamp) {
          if (val && val.$ || t.get([key, '$'])) {
            return inlineDisplay(t, val, key, stamp)
          } else {
            t.set({ sheet: { [key]: val === 'flex' ? '-webkit-flex' : val } }, stamp)
          }
        }
      }
    }, false)
  })
}

if (transformProp === 'webkitTransform') {
  style.props.inlineTransition = {
    type: 'inlineStyle',
    $transform: val => val.replace(/\btransform\b/, 'webkit-transform')
  }
  style.inject.push(t => {
    const inlineTransition = t.props.inlineTransition
    t.set({
      props: {
        transition (t, val, key, stamp) {
          if (val && val.$ || t.get([key, '$'])) {
            return inlineTransition(t, val, key, stamp)
          } else {
            t.set({ sheet: {
              [key]: val.replace(/\btransform\b/, 'webkit-transform')
            } }, stamp)
          }
        }
      }
    }, false)
  })
}

export default {
  types: {
    inlineStyle,
    style
  },
  props: {
    style: {
      type: 'style'
    }
  }
}
