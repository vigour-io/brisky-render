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
          padding: '20px',
          fontSize: '40px'
        },
        tag: 'holder',
        $: 'collection.$any',
        $any: (keys, state) => keys.concat().sort(
          (a, b) => state.get(a).compute() > state.get(b).compute() ? -1 : 1
        ),
        props: {
          default: {
            title: { text: { $: true } }
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
  state.collection[0].set(6)

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
