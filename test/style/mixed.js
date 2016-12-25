const test = require('tape')
const { create: s } = require('brisky-struct')
const { render, clearStyleCache } = require('../../')

test('style - mix styletron with classnames', t => {
  clearStyleCache()
  const state = s({
    color: 'blue',
    class: 'extra'
  })
  const elem = render({
    style: {
      padding: '10px',
      opacity: 0.5
    },
    class: {
      val: 'hello',
      extra: { $: 'class' }
    },

    text: 'hello'
  }, state)
  if (document.body) {
    document.body.appendChild(elem)
  }
  t.equal(elem.className, 'hello extra a b')
  state.class.set('gurt')
  t.equal(elem.className, 'hello gurt a b')
  t.end()
})
