var d = Date.now()
const struct = require('brisky-struct')
const render = require('../render')
const stats = require('./stats')

const state = struct({ collection: [ 1, 2 ] })

  --bg: rgb(38, 50, 56);
  --white: white;
  --fg: rgb(84, 206, 177);
  --whitea: rgba(255, 255, 255, 0.5);
  --fg2: rgb(128, 203, 196);

const app = render({
  collection: {
    $: 'collection.$any',
    props: {
      default: {
        style: {
          border: '1px solid red',
          background: '#333',
          boxShadow: '10px 10px 10px blue',
          textShadow: '0 0 2px pink'
        },
        text: { $: true },
        field: { text: 'static text' }
      }
    }
  },
}, state)

document.body.appendChild(app)

state.x.set('!!!!')

stats(state)
console.log('TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
