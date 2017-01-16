if (typeof window === 'undefined') {
  require('source-map-support').install()
}

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

require('./class')

require('./context')

require('./render')

require('./remove')

require('./widget')

require('./events')

require('./any')

require('./subscribe') // object subs and resubscribe -- object travel

require('./attr')

require('./switch')

require('./style')
