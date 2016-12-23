const { render } = require('../')
const test = require('tape')
const parse = require('parse-element')
const { create: s } = require('brisky-struct')

test('html', t => {
  const state = s({ text: 'some text' })
  t.equal(
    parse(render({ html: '<p>html</p>' })),
    '<div><p>html</p></div>',
    'static html'
  )

  const app = render(
    {
      types: {
        thing: {
          tag: 'p',
          state: {
            html: {
              $: 'text',
              $transform: (val) =>
                typeof val === 'object' ? '' : `<b>${val}</b>`
            }
          },
          static: {
            html: '<p>static</p>'
          }
        }
      },
      something: { type: 'thing' }
    },
    state
  )

  t.equal(
    parse(app),
    '<div><p><div><b>some text</b></div><div><p>static</p></div></p></div>',
    'state and static html as a component'
  )

  state.text.set(null)

  if (typeof window !== 'undefined') {
    t.equal(
      parse(app),
      '<div><p><div></div><div><p>static</p></div></p></div>',
      'removed text'
    )
  } else {
    console.log('removing nodes does not work in html element')
  }

  t.end()
})

test('html - switch', t => {
  const state = s({
    a: {
      y: [ '@', 'root', 'hello' ]
    },
    hello: {
      y: 'hello'
    },
    b: {},
    field: [ '@', 'root', 'a' ]
  })
  const elem = render({
    field: {
      $: 'field.$switch',
      props: {
        a: {
          $: 'y',
          description: {
            html: { $: 'y' }
          }
        }
      }
    }
  }, state)
  t.equals(elem.childNodes[0].innerHTML, '<div>hello</div>', 'intial')
  state.set({ field: [ '@', 'root', 'b' ], a: { y: null } })
  t.ok(true, 'should not crash on remove')
  t.end()
})
