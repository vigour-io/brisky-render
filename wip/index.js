var d = Date.now()

// import { create as struct } from 'brisky-struct'

import { render } from 'brisky-render'

import hub from 'hub.js'

console.log('yo hubs!')

// import navigator from 'vigour-ua/navigator'

console.log('!!!', global.navigator.userAgent)

var color = 'grey'

if (global.navigator.userAgent.indexOf('Firefox/') > -1) {
  color = 'blue'
}

// const c = global.briskystamp.create
// global.briskystamp.create = function () {
//   const r = c.apply(this, arguments)
//   console.error('CREATE STAMP', r)
//   return r
// }

// import stats from './stats'

const state = hub({
  url: 'ws://localhost:3031'
})

// const state = {}

const add = (state, stamp) => {
  const collection = state.get('collection', {})
  const index = Number(collection.keys()[collection.keys().length - 1]) + 1 || 0
  collection.set({ [index]: index }, stamp)
}

const app = render({
  attr: { id: 'app' },
  text: global.navigator.userAgent,
  button: {
    text: 'ADD ROW',
    on: {
      click ({ state }, stamp) {
        add(state, stamp)
      }
    }
  },
  pages: {
    switchit: {
      text: 'GO SWITCH',
      on: {
        click ({ state }, stamp) {
          const key = state.page && state.page.origin().key
          state.set({
            page: [ '@', 'root', 'pages', key === 'b' ? 'a' : 'b' ]
          }, stamp)
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
                text: { $: true }
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
                text: { $: true }
                // description: { text: { $: 'description' } }
              }
            }
          }
        }
      }
    }
  }
  // blurf: {
  //   tag: 'input',
  //   attr: {
  //     value: { $: 'bla' }
  //   },
  //   on: {
  //     input: ({ target, state }, stamp) => {
  //       state.set({ bla: target.value })
  //     }
  //   }
  // },
  // bla: {
  //   tag: 'input',
  //   attr: {
  //     // $: 'collection', $transform: val => val.keys().length  need sync false!
  //     placeholder: 'fill in a #'
  //   },
  //   on: {
  //     input: ({ target, state }, stamp) => {
  //       const keys = state.get('collection', { a: 'a' }).keys()
  //       const len = keys.length
  //       var nr = (Number(target.value) || 0) - len
  //       if (nr > 0) {
  //         while (nr--) {
  //           add(state, stamp)
  //         }
  //       } else if (!target.value) { //eslint-disable-line
  //         state.collection.set({ reset: true }, stamp)
  //       }
  //     }
  //   }
  // },
  // collection: {
  //   $: 'collection.$any',
  //   $any: {
  //     val: (keys, state) => {
  //       // for api allways pass an empty array
  //       // here something is still pretty wrong
  //       //           // .filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute' ]))
  //       // make a super efficient sort later on
  //       // so were going to get subs.props.cache for these things -- there is a lot to be gained here

  //       // cached options for everything will come in struct this will make it possible to kill it with perf!
  //       return keys && keys.slice(0, 3)
  //         // keys.filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute' ])).slice(0, 3)
  //         // .sort((a, b) => {
  //         //   return state[a].compute() < state[b].compute() ? 1 : -1
  //         // })
  //     },
  //     root: { bla: true }
  //   },
  //   props: {
  //     default: {
  //       style: {
  //         border: '1px solid rgb(120,50,50)',
  //         margin: '5px',
  //         // position: 'absolute',
  //         display: 'inline-block',
  //         background: color,
  //         color: '#eee',
  //         fontFamily: 'helvetica neue',
  //         textAlign: 'center',
  //         padding: '10px',
  //         borderRadius: '10px',
  //         width: '100px',
  //         // transition: 'transform 0.05s',
  //         zIndex: {
  //           $: 'active', $transform: (val) => val ? 1 : 0
  //         },
  //         opacity: {
  //           $: 'active', $transform: (val) => val ? 0.5 : 1
  //         }
  //         // transform: {
  //         //   x: { $: 'x' },
  //         //   y: { $: 'y' },
  //         //   scale: { $: 'active', $transform: (val) => val ? 3 : 1 }
  //         // }
  //       },
  //       text: {
  //         $: true
  //       },
  //       field: { text: 'a' },
  //       other: { text: 'b' },
  //       field2: { text: 'c' },
  //       field3: { text: 'd' },
  //       remove: {
  //         tag: 'button',
  //         text: 'REMOVE',
  //         style: {
  //           padding: '20px',
  //           backgroundColor: '#pink'
  //         },
  //         on: {
  //           down: ({ state }, stamp) => state.set(null, stamp)
  //         }
  //       }
  //       // on: {
  //         // down: ({ state }) => {
  //         //   state.set({ active: !state.get([ 'active', 'compute' ]) })
  //         // },
  //         // up: ({ state }) => {
  //         //   console.log('not removed?')
  //         //   state.set({ active: false })
  //         // },
  //         // move: ({ state, x, y, target }, stamp) => {
  //         //   if (state.get([ 'active', 'compute' ])) {
  //         //     // const rect = target.getBoundingClientRect()
  //         //     state.set({
  //         //       x: x - 75,
  //         //       y: y - 75
  //         //     }, stamp)
  //         //   }
  //         // }
  //       // }
  //     }
  //   }
  // }

}, state)

global.state = state

// stats(state, 3)

// export default app

if (document.body) {
  console.log('re-render')
  document.body.appendChild(app)
}
