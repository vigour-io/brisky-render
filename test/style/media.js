const test = require('tape')
const { create } = require('brisky-struct')
const { render, clearStyleCache } = require('../../')
const parse = require('parse-element')
const strip = require('strip-formatting')

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

  t.equal(elem.className, 'hello extra a b c a1')
  state.class.set('gurt')
  t.equal(elem.className, 'hello gurt a b c a1')
  t.end()
})

test('style - dynamic media styletron', t => {
  clearStyleCache()
  const state = create({
    color: 'blue'
  })

  const elem = render({
    style: {
      '@media (min-width: 480px)': {
        backgroundColor: 'red',
        color: {
          $: 'color'
        }
      }
    }
  }, state)

  if (document.body) document.body.appendChild(elem)

  t.equal(parse(elem), strip(`<div class=" a1 b194596312"><style data-style="true">  @media (min-width: 480px) { .b194596312 {color:blue;} .a1 {background-color:red;} } </style></div>`))

  // update it
  state.set({ color: 'red' })

  t.equal(parse(elem), strip(`<div class=" a1 b194596312"><style data-style="true">  @media (min-width: 480px) { .b194596312 {color:red;} .a1 {background-color:red;} } </style></div>`))

  t.end()
})

test('style - dynamic media styletron + transforms', t => {
  clearStyleCache()
  const state = create({
    color: 'blue'
  })

  const elem = render({
    style: {
      '@media (min-width: 480px)': {
        backgroundColor: 'red',
        color: {
          $: 'color',
          $transform: val => 'yellow'
        }
      }
    }
  }, state)

  if (document.body) document.body.appendChild(elem)

  t.equal(parse(elem), strip(`<div class=" a1 b194596312"><style data-style="true">  @media (min-width: 480px) { .b194596312 {color:yellow;} .a1 {background-color:red;} } </style></div>`))

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

  t.equal(parse(elem), strip(`<div><div class=" a a1">a</div><div class=" b c a2 b1">b</div><style data-style="true"> .a {background:yellow;} .b {background:grey;} .c {min-width:50%;}  @media (min-width: 700px) { .a1 {background:red;} .b1 {background:yellow;} } @media (min-width: 480px) { .a2 {background:blue;} } </style></div>`))

  t.end()
})

test('style - a should not be blue', t => {
  clearStyleCache()
  const elem = render({
    a: {
      style: {
        [`@media (min-width: 10000px)`]: {
          background: 'blue'
        }
      },
      text: 'a'
    },
    b: {
      style: {
        [`@media (min-width: 100px)`]: {
          background: 'blue'
        }
      },
      text: 'b'
    }
  })

  if (document.body) document.body.appendChild(elem)

  t.equal(parse(elem), `<div><div class=" a1">a</div><div class=" a2">b</div><style data-style="true">  @media (min-width: 10000px) { .a1 {background:blue;} } @media (min-width: 100px) { .a2 {background:blue;} } </style></div>`)

  t.end()
})
