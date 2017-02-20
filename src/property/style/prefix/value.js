// src: http://shouldiprefix.com
// import ua from 'vigour-ua/navigator'
import prefixes from './'

const prefix = {}

// if (ua.browser === 'safari' || ua.platform === 'ios') {
//   prefix.display = val => val === 'flex' ? '-webkit-flex' : val
// }

if (prefixes.transform === 'webkitTransform') {
  prefix.transition = val => val.replace(/\btransform\b/, 'webkit-transform')
}

export default prefix
