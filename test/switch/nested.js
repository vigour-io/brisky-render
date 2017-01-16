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
      a: {
        tag: 'a',
        switcher: {
          $: 'field.navigation.$switch',
          $switch: state => state.origin().key,
          props: {
            first: {
              tag: 'b',
              on: {
                remove (data) {
                  const node = data.target
                  node.parentNode.removeChild(node)
                }
              },
              c: {
                tag: 'c',
                text: { $: 'title', $transform: val => val + '?' },
                switcher: {
                  $: 'navigation.$switch',
                  $switch: state => {
                    return state.origin().key
                  },
                  props: {
                    first: {
                      tag: 'd',
                      gucci: {
                        tag: 'e',
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
                      tag: 'd',
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
        <a>
          <b>
            <c>first?<d><e>🐔</e>💸!</d></c>
          </b>
        </a>
      </div>
    `),
    'switch nested switcher to "$root.otheritems[1]"'
  )

  state.items.first.navigation.set([ '@', 'root', 'items', 'second' ])

  t.equal(
    parse(app),
     strip(`
      <div>
        <a>
          <b>
            <c>first?<d>🌟🌟🌟🌟</d></c>
          </b>
        </a>
      </div>
    `),
    'switch nested switcher to "$root.otheritems[1]"'
  )

  t.end()
})

test('switch - nested - b', t => {
  const app = render({
    key: 'app',
    tag: 'app',
    a: {
      $: 'page.$switch',
      $switch: () => 'b',
      props: {
        b: {
          tag: 'b',
          // navbar: { tag: 'nav' },
          c: {
            tag: 'c',
            switcher: {
              $: 'current.$switch',
              $switch: () => 'd',
              props: { d: { tag: 'd' } }
            }
          }
        }
      }
    }
  }, { page: { current: {} } })

  t.equals(
    parse(app),
    strip(
      `<app>
         <b>
           <c>
             <d></d>
           </c>
         </b>
      </app>`
    )
  )

  t.end()
})
