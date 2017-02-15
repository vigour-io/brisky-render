// src: http://shouldiprefix.com
import ua from 'vigour-ua/navigator'

const prefix = {}

if (ua.prefix === 'moz') {
  prefix.appearance = 'mozAppearance'
} else if (
  ua.prefix === 'webkit' ||
  ua.browser === 'ie' ||
  ua.browser === 'edge'
) {
  prefix.appearance = 'webkitAppearance'
}

if (ua.browser === 'chrome' || ua.browser === 'safari') {
  prefix.filter = 'webkitFilter'
}

if (ua.platform === 'ios' || ua.browser === 'safari') {
  prefix.flex = 'WebkitFlex'
} else if (ua.browser === 'ie') {
  prefix.flex = 'msFlex'
  if (ua.version === 10) {
    prefix.order = 'msFlexOrder'
  }
}

if (
  (ua.browser === 'chrome' && ua.version < 36) ||
  (ua.browser === 'safari' && ua.version > 5.1) ||
  (ua.platform === 'ios' && ua.version < 9.2) ||
  (ua.platform === 'android' && ua.version <= 4.5)// 4.4.4
) {
  prefix.transform = 'WebkitTransform'
} else {
  prefix.transform = 'transform'
}

export default prefix
