const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('strip-formatting')
const s = require('brisky-struct')

test('any - sort', t => {
  const app = {
    types: {
      special: {
        type: 'style',
        fontSize: '40px',
        textAlign: 'center',
        padding: '5px',
        background: 'rgb(51, 51, 51)',
        color: 'rgb(238, 238, 238)',
        opacity: 1
      },
      holder: {
        style: {
          borderTop: '1px solid rgb(51, 51, 51)',
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
              type: 'special',
              display: 'inline-block',
              borderRadius: '50%',
              margin: '15px',
              width: '50px',
              height: '50px',
              color: { $: 'color' },
              something: { $: 'blurf' },
              fontWeight: { $: 'styles.weight' },
              transition: 'transform 0.5s',
              transform: {
                scale: { $: true, $transform: val => (5 + val) / 10 }
              }
            },
            text: { $: true },
            text2: { type: 'text', $: 'root.james' }
          }
        }
      }
    },
    props: {
      default: {
        type: 'holder'
      }
    },
    a: {},
    b: {},
    c: {
      $any: (keys, state) => keys.filter(val => state.get(val).compute() > 4)
    },
    hello: {
      type: 'element',
      hello: {
        $: 'query',
        style: {
          type: 'special'
        },
        text: { $: 'root.james' }
      }
    },
    d: {
      $any: {
        val: (keys, state) => {
          var x = keys.filter(
            val => {
              return state.root().query.compute() == state[val].compute() || state.root().james.compute() == state[val].compute() //eslint-disable-line
            }
          )
          return x
        },
        root: {
          query: true,
          james: true
        },
        color: {
          val: true,
          smurf: true
        },
        blurf: 1,
        styles: { val: true }
        // same as well -- need to test
      }
    }
  }

  const state = s({
    collection: [ 1, 2, 3, 4, 5 ],
    query: 1,
    james: '!'
  })

  state.collection.set(state.collection.map(val => ({ val: val.compute(), color: 'rgb(' + val.compute() * 20 + ', 100, 100)' })))

  const elem = render(app, state)

  var cnt = 0
  const defer = (val) => new Promise(resolve => {
    setTimeout(() => resolve(val), (++cnt))
  })

  state.collection.set(defer({ 0: 6 }))
  state.collection.set(defer({ 3: 7 }))
  state.collection.set(defer({ 4: 1 }))
  state.collection.set(defer({ 0: 1 }))
  state.query.set(defer(7))
  state.james.set(defer(1))

  if (document.body) {
    document.body.appendChild(elem)
  }

  const result = strip(`<div><div style="border-top: 1px solid rgb(51, 51, 51); padding: 50px; text-align: center;"><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(80, 100, 100); transform: scale(1.2);">71</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(60, 100, 100); transform: scale(0.8);">31</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(40, 100, 100); transform: scale(0.7);">21</div></div><div style="border-top: 1px solid rgb(51, 51, 51); padding: 50px; text-align: center;"><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(80, 100, 100); transform: scale(1.2);">71</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(60, 100, 100); transform: scale(0.8);">31</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(40, 100, 100); transform: scale(0.7);">21</div></div><div style="border-top: 1px solid rgb(51, 51, 51); padding: 50px; text-align: center;"><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(80, 100, 100); transform: scale(1.2);">71</div></div><div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); color: rgb(238, 238, 238); opacity: 1;">1</div></div><div style="border-top: 1px solid rgb(51, 51, 51); padding: 50px; text-align: center;"><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(20, 100, 100); transform: scale(0.6);">11</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(80, 100, 100); transform: scale(1.2);">71</div><div style="font-size: 40px; text-align: center; padding: 5px; background: rgb(51, 51, 51); opacity: 1; display: inline-block; border-radius: 50%; margin: 15px; width: 50px; height: 50px; transition: transform 0.5s; color: rgb(100, 100, 100); transform: scale(0.6);">11</div></div></div>`)

  state.james.once(1, () => {
    setTimeout(() => {
      t.equal(
        parse(elem),
        result
      )
      t.end()
    })
  })
})
