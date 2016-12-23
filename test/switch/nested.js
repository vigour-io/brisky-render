const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const { create: s } = require('brisky-struct')
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
              on: {
                remove (data) {
                  const node = data.target
                  node.parentNode.removeChild(node)
                }
              },
              nest: {
                tag: 'switchsecond',
                text: { $: 'title', $transform: val => val + '?' },
                switcher: {
                  $: 'navigation.$switch',
                  $switch: state => {
                    return state.origin().key
                  },
                  props: {
                    first: {
                      gucci: {
                        text: '🐔'
                      },
                      text: { $: 'title', $transform: val => val + '!' },
                      on: {
                        remove (data) {
                          const node = data.target
                          cnt++
                          var fader = 3
                          const fade = () => {
                            fader--
                            // node.childNodes[0].innerHTML += '🐔'
                            if (fader > 0) {
                              fade()
                            } else {
                              node.parentNode.removeChild(node)
                            }
                          }
                          fade()
                        }
                      }
                    },
                    second: {
                      text: { $: 'rating', $transform: val => (new Array(val)).join('🌟') }
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
    state
  )

  state.set({
    first: { title: '💸' },
    otheritems: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    items: {
      first: {
        title: 'first',
        navigation: {}
      },
      second: {
        rating: 5
      }
    },
    field: {
      val: 'blurf',
      navigation: {
        val: [ '@', 'root', 'items', 'first' ]
      }
    }
  })

  if (document.body) {
    document.body.appendChild(app)
  }

  state.items.first.navigation.set([ '@', 'root', 'items', 'first' ])
  state.items.first.navigation.set([ '@', 'root', 'items', 'second' ])

  t.equal(cnt, 1, 'remove listener fired')

  state.items.first.navigation.set([ '@', 'root', 'items', 'first' ])
  state.items.first.navigation.set([ '@', 'root', 'first' ])

  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <first>
            <switchsecond>first?</switchsecond>
            </first>
              <div>
                <div>🐔</div>
                💸!
              </div>
            </holder>
          </div>
    `),
    'switch nested switcher to "$root.otheritems[1]"'
  )

  state.items.first.navigation.set([ '@', 'root', 'items', 'second' ])

  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <first>
            <switchsecond>first?</switchsecond>
          </first>
          <div>🌟🌟🌟🌟</div>
        </holder>
      </div>
    `),
    'switch nested switcher to "$root.otheritems[1]"'
  )

  t.end()
})
