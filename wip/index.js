var d = Date.now()

import { create as struct } from 'brisky-struct'

import { render } from '../lib'

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
      value: {
        $: 'bla'
      }
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
        console.log(keys.filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute'])))
        return keys.filter(key => state.get(key).compute() > state.root().get([ 'bla', 'compute']))
      },
      root: {
        bla: true
      }
    },
    props: {
      default: {
        style: {
          border: '1px solid blue',
          margin: '20px',
          background: color,
          color: 'rgb(221, 03, 196)',
          fontFamily: 'courier',
          textAlign: 'center',
          padding: '10px'
        },
        text: { $: true },
        field: { text: 'static' },
        other: { text: 'xrx' },
        field2: { text: 'hxxe' },
        field3: { text: 'static text' }
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
