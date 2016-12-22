var d = Date.now()

import { create as struct } from 'brisky-struct'

import { render } from 'brisky-render'

// import navigator from 'vigour-ua/navigator'

console.log('!!!', global.navigator.userAgent)

var color = 'grey'

if (global.navigator.userAgent.indexOf('Firefox/') > -1) {
  color = 'blue'
}

import stats from './stats'

const state = struct({ collection: [ 1, 2 ], bla: 1 })

const app = render({
  attr: { id: 'app' },
  text: global.navigator.userAgent,
  bla: {
    tag: 'input',
    attr: {
      value: { $: 'bla' }
    },
    on: {
      input: ({ target, state }, stamp) => {
        state.set({ bla: target.value }, stamp)
      }
    }
  },
  collection: {
    $: 'collection.$any',
    $any: {
      val: (keys, state) => {
        return keys.filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute' ]))
      },
      root: {
        bla: true
      }
    },
    props: {
      default: {
        style: {
          border: '11px solid rgb(20,50,50)',
          margin: '50px',
          background: color,
          color: '#eee',
          fontFamily: 'helvetica neue',
          textAlign: 'center',
          padding: '20px',
          borderRadius: '10px'
        },
        text: { $: true },
        field: { text: 'static' },
        other: { text: 'static' },
        field2: { text: 'static' },
        field3: { text: 'static' }
      }
    }
  }

}, state)

stats(state, 3)

export default app

if (document.body) {
  console.log('re-render')

  // app
  console.log(app)

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
