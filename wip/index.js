var d = Date.now()

import { create as struct } from 'brisky-struct'

import { render } from 'brisky-render'

import hub from 'hub.js'

console.log('yo hubs!')

// import navigator from 'vigour-ua/navigator'

console.log('!!!', global.navigator.userAgent)

var color = 'grey'

if (global.navigator.userAgent.indexOf('Firefox/') > -1) {
  color = 'blue'
}

// import stats from './stats'

const state = hub({
  bla: 'x',
  url: 'ws://localhost:3031'
})

const add = (state) => {
  const collection = state.get('collection', {})
  collection.push({
    val: 'hello!',
    x: (collection.keys() || []).length * 2,
    y: (collection.keys() || []).length * 2
  })
}

const app = render({
  attr: { id: 'app' },
  text: global.navigator.userAgent,
  button: {
    text: 'ADD ROW',
    on: {
      click ({ state }) {
        add(state)
      }
    }
  },
  pages: {
    switchit: {
      text: 'GO SWITCH',
      on: {
        click ({ state }) {
          const key = state.page && state.page.origin().key
          state.set({
            page: [ '@', 'root', 'pages', key === 'b' ? 'a' : 'b' ]
          })
        }
      }
    },
    page: {
      $: 'page.$switch',
      props: {
        a: {
          text: 'page-a',
          fields: {
            $: 'fields.$any',
            props: {
              default: {
                text: { $: 'title' }
              }
            }
          }
        },
        b: {
          text: '===> page-b <===',
          title: {
            text: { $: 'title' }
          },
          fields: {
            $: 'fields.$any',
            props: {
              default: {
                text: { $: 'title' },
                description: { text: { $: 'description' } }
              }
            }
          }
        }
      }
    }
  },
  bla: {
    tag: 'input',
    attr: {
      // this is too heavy constantly fires --- lets cache before setting value (else very annoying)
      value: { $: 'collection', $transform: val => val.keys().length }
    },
    on: {
      input: ({ target, state }, stamp) => {
        var nr = Number(target.value) - state.get('collection', { a: 'a' }).keys().length
        if (nr > 0) {
          while (nr--) {
            add(state)
          }
        }
      }
    }
  },
  collection: {
    $: 'collection.$any',
    // $any: {
    //   val: (keys, state) => {
    //     return keys.filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute' ]))
    //   },
    //   root: {
    //     bla: true
    //   }
    // },
    props: {
      default: {
        style: {
          border: '1px solid rgb(120,50,50)',
          margin: '5px',
          position: 'absolute',
          // display: 'inline-block',
          background: color,
          color: '#eee',
          fontFamily: 'helvetica neue',
          textAlign: 'center',
          padding: '10px',
          borderRadius: '10px',
          width: '100px',
          // transition: 'transform 0.05s',
          height: '100px',
          zIndex: {
            $: 'active', $transform: (val) => val ? 1 : 0
          },
          opacity: {
            $: 'active', $transform: (val) => val ? 0.5 : 1
          },
          transform: {
            x: { $: 'x' },
            y: { $: 'y' },
            scale: { $: 'active', $transform: (val) => val ? 3 : 1 }
          }
        },
        text: {
          $: true
        },
        field: { text: 'static' },
        other: { text: 'static' },
        field2: { text: 'static' },
        field3: { text: 'static' },
        on: {
          click: ({ state }) => {
            state.set({ active: !state.get([ 'active', 'compute' ]) })
          },
          move: ({ state, x, y, target }, stamp) => {
            if (state.get([ 'active', 'compute' ])) {
              // const rect = target.getBoundingClientRect()
              state.set({
                x: x - 75,
                y: y - 75
              }, stamp)
            }
          }
        }
      }
    }
  }

}, state)

global.state = state

// stats(state, 3)

// export default app

if (document.body) {
  console.log('re-render')

  // app
  // console.log(app)

  document.body.childNodes

  // need to do id
  // const pr = document.getElementById('app')
  // if (pr) {
  //   document.body.removeChild(pr)
  // }
  document.body.appendChild(app)
  // console.log('CREATE TOTAL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  // d = Date.now()
  // state.collection[state.collection.keys().length - 1].set('hello')
  // console.log('UPDATE ONE:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
  // d = Date.now()
  // state.collection.set(state.collection.map(p => p.compute() + '!'))
  // console.log('UPDATE ALL:', Date.now() - d, 'ms', document.getElementsByTagName('*').length, 'dom elements')
}
