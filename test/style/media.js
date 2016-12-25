const test = require('tape')
const { create } = require('brisky-struct')
const { render } = require('../../')

test('style - media styletron with classnames', t => {
  const state = create({
    color: 'blue',
    class: 'extra'
  })

  const elem = render({
    x: {
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
  if (document.body) {
    document.body.appendChild(elem)
  }
  t.equal(elem.className, 'hello extra a b')
  state.class.set('gurt')
  t.equal(elem.className, 'hello gurt a b')
  t.end()
})
