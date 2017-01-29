if (typeof window === 'undefined') {
  require('source-map-support').install()
}

const { element } = require('../')
// require('./sync') // not for now

require('./fragment')

require('./order')

require('./text')

require('./parent')

require('./html')

require('./clone')

require('./reference')

require('./property')

require('./group')

require('./test')

require('./context')

require('./remove')

require('./widget')

require('./events')

require('./any')

require('./attr')

require('./switch')

require('./style')

require('./subscribe') // object subs and resubscribe -- object travel

require('./class')

require('./render')
