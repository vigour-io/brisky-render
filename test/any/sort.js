const render = require('../../render')
const test = require('tape')
// const parse = require('parse-element')
// const strip = require('strip-formatting')
const s = require('brisky-struct')

test('any - sort', t => {
  const app = {
    holder: {
      tag: 'holder',
      $: 'collection.$any',
      $any: (keys, state) => {
        return keys.filter(val => val > 2)
      },
      props: {
        default: {
          title: { text: { $: true } }
        }
      }
    }
  }

  const state = s({
    collection: [ 1, 2, 3, 4, 5 ]
  })

  const elem = render(app, state)

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
