const test = require('tape')
const { create } = require('brisky-struct')
const { render } = require('../../')

test('style - media styletron with classnames', t => {
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
    x: {
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
    },
    y: {
      style: {
        padding: '10px',
        opacity: 0.5
      },
      class: {
        val: 'hello',
        extra: { $: 'class' }
      },
      text: 'hello'
    }
  }, state)

  if (document.body) document.body.appendChild(elem)

  t.equal(elem.className, 'hello extra a b')
  state.class.set('gurt')
  t.equal(elem.className, 'hello gurt a b')
  t.end()
})
