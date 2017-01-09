import iterator from './iterator'
import switcher from './type/switcher'
import any from './type/any'
import normal from './type'
import object from './type/object'
import { get$, get$any, get$switch } from '../../get'
import subscriber from './subscriber'

// dont define just require
export default {
  define: {
    $map (map, prev, ignoreSwitch) {
      var returnValue
      const $ = get$(this)
      if (!map) {
        returnValue = map = this._$map = { _: { p: prev || false } }
      }
      this.isStatic = null
      if ($) {
        if (typeof $ === 'object' && !($ instanceof Array)) {
          if (!returnValue) { returnValue = true }
          map = object(this, map)
        } else {
          if ($[0] === 'root' && (!map || !map._ || !map._.p)) $.shift()
          if (!returnValue) returnValue = true
          if (get$switch(this) && !ignoreSwitch) {
            map = switcher(this, map)
          } else if (get$any(this)) {
            map = any(this, map)
          } else {
            map = normal(this, map)
          }
        }
      } else if (iterator(this, map) || returnValue) {
        subscriber(map, this, 't')
        if (!returnValue) { returnValue = true }
      }

      return returnValue
    }
  }
}
