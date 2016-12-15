import parent from '../../render/dom/parent'
import { property } from '../../render/static'

// not good enough -- need to parse it (for server side)
import ua from 'vigour-ua/navigator'
import type from './type'
import px from './px'
import transform from './transform'

const injectable = {}

export default injectable

injectable.types = {
  styleProp: type,
  style: {
    type: 'property',
    render: {
      static (t, pnode) {
        property(t, pnode)
      },
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
    inject: [
      px,
      transform
    ],
    props: {
      default: { type: 'styleProp' },
      order: {
        // put ua info on top for server or from render for example
        // or add both for now
        name: ua.browser === 'ie' && ua.version === 10 ? 'msFlexOrder' : 'order'
      }
    }
  }
}

injectable.props = {
  style: {
    type: 'style'
  }
}
