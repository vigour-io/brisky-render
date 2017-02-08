import render from './render'
import element from './element'
import parent from './render/dom/parent'
import attr from './property/attr'
import { clear as clearStyleCache } from './property/style/sheet'

if (typeof __dirname !== 'undefined') console.log('hub.js:', __dirname)

export { render, element, parent, attr, clearStyleCache }
