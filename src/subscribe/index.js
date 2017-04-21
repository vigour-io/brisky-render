import globSwitch from './map/type/switcher/glob'
import { get$any, get$switch } from '../get'

const injectable = {}

export default injectable

injectable.props = {
  $ (t, val) {
    if (typeof val === 'number' && !isNaN(val)) {
      val = [ val + '' ]
    } else if (typeof val === 'string') {
      val = val.split('.')
    }
    if (Array.isArray(val)) {
      let length = val.length
      const last = val[length - 1]
      if (last === '$any') {
        if (!t.$any) {
          t.$any = true
        }
        length--
      } else if (get$any(t)) {
        t.$any = null
      } else if (last === '$switch') {
        if (!get$switch(t)) { t.$switch = globSwitch }
      } else if (get$switch(t)) {
        t.$switch = null
      }
      t._$length = length
    } else {
      t._$length = null
    }
    t.$ = val
    return true
  },
  isStatic: true,
  $switch: true,
  $any: true,
  subscriptionType: true,
  render (t, val) {
    t.set({
      define: {
        render: val
      }
    })
  }
}

import map from './map'
injectable.subscriptionType = 'switch'
injectable.inject = map

/*
more merge tests
*/
