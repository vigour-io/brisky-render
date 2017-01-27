const { render, clearStyleCache } = require('../')
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
  clearStyleCache()
  const state = s({ loader: 1 })

  const strange = document.createElement('html')

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
        bla: {
          text: 'x',
          style: { border: '1px solid red' }
        }
      }
    },
    state
  )

  t.equal(app, strange, 'enhances original')

  /*
    '<strange><head><link rel="shortcut icon" href="1.jpg"></link><title>1</title></head><body>x<div class=" a"></div></body><style> .a {border:1px solid red;} </style></strange>'
  */

  // overwrites existing (this is debatable)
  t.equal(p(app),
    typeof window === 'undefined'
      ? strip(`
      <html>
         <head>
            <link rel="shortcut icon" href="1.jpg"></link>
            <title>1</title>
            <style> .a {border:1px solid red;} </style>
         </head>
         <body><div class=" a">x</div></body>
      </html>
    `)
    : strip(`
      <html>
         <head>
            <link rel="shortcut icon" href="1.jpg">
            <title>1</title>
            <style> .a {border:1px solid red;} </style>
         </head>
         <body><div class=" a">x</div></body>
      </html>
    `)
    )

  t.end()
})
