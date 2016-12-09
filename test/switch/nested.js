'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('brisky-struct')
const strip = require('strip-formatting')

test('switch - nested', t => {
  const state = s({ field: { navigation: {} } })
  var cnt = 0
  const app = render(
    {
      holder: {
        tag: 'holder',
        switcher: {
          $: 'field.navigation.$switch',
          $switch: state => state.origin().key,
          props: {
            first: {
              tag: 'first',
              nest: {
                tag: 'switchsecond',
                text: { $: 'title' },
                switcher: {
                  $: 'navigation.$switch',
                  $switch: state => {
                    console.warn('xxxx')
                    return state.origin().key
                  },
                  props: {
                    first: {
                      text: { $: 'title' },
                      on: {
                        remove (data) {
                          console.error('?????')
                          const node = data.target
                          cnt++
                          node.parentNode.removeChild(node)
                        }
                      }
                    },
                    second: {
                      text: { $: 'rating' }
                    }
                  }
                }
              }
            },
            second: {
              tag: 'second',
              text: { $: 'rating' }
            }
          }
        }
      }
    },
    state,
    s => {
      // console.warn(s)
    }
  )

  state.set({
    otheritems: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    items: {
      first: {
        title: 'first',
        navigation: {}
      },
      second: { rating: 100 }
    },
    field: {
      val: 'blurf',
      navigation: [ '@', 'root', 'items', 'first' ]
    }
  })

  if (document.body) {
    document.body.appendChild(app)
  }

  state.items.first.navigation.set([ '@', 'root', 'items', 'first' ])

  state.items.first.navigation.set([ '@', 'root', 'items', 'second' ])

  t.equal(cnt, 1, 'remove listener fired')
  // state.field.navigation.set('$root.items[-1]')
  // t.equal(
  //   parse(app),
  //    strip(`
  //     <div>
  //       <holder>
  //         <first>
  //           <switchsecond>
  //             first
  //             <div>100</div>
  //           </switchsecond>
  //         </first>
  //       </holder>
  //     </div>
  //   `),
  //   'switch nested switcher to "$root.otheritems[1]"'
  // )
  // state.field.navigation.set([ '@', 'root', 'items', 'first' ])
  // t.equal(
  //   parse(app),
  //    strip(`
  //     <div>
  //       <holder>
  //         <second>100</second>
  //       </holder>
  //     </div>
  //   `),
  //   'switch switcher to "$root.items[1]"'
  // )

  t.end()
})
