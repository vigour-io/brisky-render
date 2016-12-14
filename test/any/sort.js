const render = require('../../render')
const test = require('tape')
// const parse = require('parse-element')
// const strip = require('strip-formatting')
const s = require('brisky-struct')

test('any - sort', t => {
  const app = {
    types: {
      holder: {
        style: {
          borderTop: '1px solid #333',
          padding: '50px',
          textAlign: 'center'
        },
        $: 'collection.$any',
        $any: (keys, state) => keys.concat().sort(
          (a, b) => state.get(a).compute() > state.get(b).compute() ? -1 : 1
        ).slice(0, 3),
        props: {
          default: {
            style: {
              display: 'inline-block',
              fontSize: '40px',
              borderRadius: '50%',
              margin: '15px',
              textAlign: 'center',
              padding: '5px',
              background: '#333',
              width: '50px',
              height: '50px',
              color: '#eee'
            },
            text: { $: true }
          }
        }
      }
    },
    a: { type: 'holder' },
    b: { type: 'holder' },
    c: {
      type: 'holder',
      // need to subscribe in an object to make this work...
      $any: (keys, state) => keys.filter(val => state.get(val).compute() > 4)
    }
  }

  const state = s({
    collection: [ 1, 2, 3, 4, 5 ]
  })

  const elem = render(app, state, (s, tree, app, ss, type) => {
    if (ss) {
      console.warn(ss.path(), type)
    }
  })

  console.log('go go go')

  var cnt = 0
  const defer = (val) => new Promise(resolve => {
    setTimeout(() => resolve(val), (++cnt) * 500)
  })

  state.collection.set(defer({ 0: 6 }))
  state.collection.set(defer({ 3: 7 }))
  state.collection.set(defer({ 4: 1 }))
  state.collection.set(defer({ 0: 1 }))

  // t.equal(
  //   parse(elem),
  //   strip(`
  //     <div>
  //       <holder>
  //         <span><div>a</div></span>
  //         <span><div>b</div></span>
  //       </holder>
  //       2
  //     </div>
  //   `)
  // )

  if (document.body) {
    document.body.appendChild(elem)
  }

  t.end()
})
