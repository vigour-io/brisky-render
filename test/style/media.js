const test = require('tape')
const { create } = require('brisky-struct')
const { render, clearStyleCache } = require('../../')
const parse = require('parse-element')

test('style - media styletron with classnames', t => {
  clearStyleCache()
  const state = create({
    color: 'blue',
    class: 'extra'
  })

  // var i = 1000 // need test for this
  // var arr = []
  // while (i--) {
  //   arr.push({
  //     text: i,
  //     style: {
  //       border: '1px solid red',
  //       backgroundColor: 'pink',
  //       padding: `${i}px`
  //     }
  //   })
  // }

  const elem = render({
    // vibes: arr,
    style: {
      padding: '10px',
      opacity: 0.5,
      backgroundColor: 'blue',
      '@media (min-width: 480px)': {
        color: 'red'
      }
    },
    class: {
      val: 'hello',
      extra: { $: 'class' }
    },
    text: 'hello'
  }, state)

  if (document.body) document.body.appendChild(elem)

  t.equal(elem.className, 'hello extra a b c _d')
  state.class.set('gurt')
  t.equal(elem.className, 'hello gurt a b c _d')
  t.end()
})

test('style - multiple media queries', t => {
  clearStyleCache()
  const elem = render({
    a: {
      text: 'a',
      style: {
        background: 'yellow',
        '@media (min-width: 700px)': {
          background: 'red'
        }
      }
    },
    b: {
      text: 'b',
      style: {
        background: 'grey',
        minWidth: '50%',
        '@media (min-width: 480px)': {
          background: 'blue'
        },
        '@media (min-width: 700px)': {
          background: 'yellow'
        }
      }
    }
  })

  if (document.body) document.body.appendChild(elem)

  t.equal(parse(elem), '<div><div class=" a _b">a</div><div class=" c d _e _a">b</div><style> .a {background:yellow;} .b {background:red;} .c {background:grey;} .d {min-width:50%;} .e {background:blue;}  @media (min-width: 700px) { ._b {background:red;} ._a {background:yellow;} } @media (min-width: 480px) { ._e {background:blue;} } </style></div>')

  t.end()
})
