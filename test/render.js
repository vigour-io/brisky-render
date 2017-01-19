const { render } = require('../')
const test = require('tape')
const { create: s } = require('brisky-struct')
const p = require('parse-element')
const strip = require('strip-formatting')

test('render - $any on top', t => {
  const state = s([ 1, 2 ])
  const app = render(
    {
      $: '$any',
      tag: 'ul',
      props: {
        default: {
          tag: 'li',
          text: { $: true }
        }
      }
    },
    state
  )
  t.equal(p(app), '<ul><li>1</li><li>2</li></ul>', 'initial')
  t.end()
})

test('render - $switch on top', t => {
  const state = s({
    text: ':/',
    html: ':)'
  })
  const app = render(
    {
      switcher: {
        $: 'a.$switch',
        $switch: state => state.origin().key,
        props: {
          text: { type: 'text', $: true },
          html: { type: 'element', html: { $: true } }
        }
      }
    },
    state
  )
  t.equal(p(app), '<div></div>', 'initial')
  state.set({ a: state.text })
  t.equal(p(app), '<div>:/</div>', 'swtich')
  state.a.set(state.html)
  t.equal(p(app), '<div><div>:)</div></div>', 'change reference')
  t.end()
})

test('render - to element', t => {
  const state = s({ loader: 1 })

  const strange = document.createElement('strange')

  const head = document.createElement('head')
  head.innerHTML = 'blurf'
  strange.appendChild(head)

  const app = render(
    strange,
    {
      head: {
        tag: 'head',
        favicon: {
          tag: 'link',
          attr: {
            rel: 'shortcut icon',
            href: {
              $: 'loader',
              $transform: val => `${val}.jpg`
            }
          }
        },
        title: { tag: 'title', text: { $: 'loader' } } // make some default
      },
      body: {
        tag: 'body',
        text: 'x'
      }
    },
    state
  )

  t.equal(app, strange, 'enahnces original')

  // overwrites existing (this is debatable)
  t.equal(p(app),
    typeof window === 'undefined'
      ? strip(`
      <strange>
         <head>
            <link rel="shortcut icon" href="1.jpg"></link>
            <title>1</title>
         </head>
         <body>x</body>
      </strange>
    `)
    : strip(`
      <strange>
         <head>
            <link rel="shortcut icon" href="1.jpg">
            <title>1</title>
         </head>
         <body>x</body>
      </strange>
    `)
    )

  t.end()
})
