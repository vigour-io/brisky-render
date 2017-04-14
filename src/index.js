import render from './render'
import element from './element'
import parent from './render/dom/parent'
import attr from './property/attr'
import prefix from './property/style/prefix'
import './size'

/*
window.getDevicePixelRatio = function () {
    var ratio = 1;
    // To account for zoom, change to use deviceXDPI instead of systemXDPI
    if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI       !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
        // Only allow for values > 1
        ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
    }
    else if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }
    return ratio;
}
*/

if (!global.devicePixelRatio) {
  global.devicePixelRatio = 1
}

import { clear as clearStyleCache } from './property/style/sheet'

if (typeof __filename !== 'undefined') console.log('brisky-render:', __filename)

export { render, element, parent, attr, clearStyleCache, prefix }
