'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const strip = require('vigour-util/strip/formatting')
const s = require('brisky-struct')

test('any - basic', function (t) {
  const app = {
    holder: {
      $: 'collection.$any',
      child: {
        tag: 'span',
        title: { text: { $: 'title' } }
      }
    }
  }

  const state = s({
    collection: [
      { title: 'a' },
      { title: 'b' }
    ]
  })

  const elem = render(app, state)

  t.equal(
    parse(elem),
    '<div><div><span><div>a</div></span><span><div>b</div></span></div></div>',
    'create multiple rows'
  )

  state.collection[0].remove()
  t.equal(
    parse(elem),
    '<div><div><span><div>b</div></span></div></div>',
    'remove first row'
  )

  try {
    render({ holder: { $: 'collection.$any' } }, state)
  } catch (e) {
    t.ok(e.message.indexOf('$any: child === Element. Define a child Element') !== -1,
      'throws error when no child is defined'
    )
  }

  t.equal(
    parse(
      render({
        types: {
          span: {
            tag: 'span',
            title: { text: { $: 'title' } }
          },
          collection: {
            $: 'collection.$any',
            child: { type: 'span' }
          }
        },
        holder: { type: 'collection' }
      }, state)
    ),
    '<div><div><span><div>b</div></span></div></div>',
    'context render'
  )
  t.end()
})

test('any - reference', function (t) {
  const state = {
    products: {
      items: {
        paid_full: {
          icon: 'star',
          title: 'Paid Full',
          currency: '$',
          price: '123',
          pricePostfix: '/month'
        }
      }
    },
    user: {
      name: 'John Doe',
      email: 'test@vigour.io',
      avatar: false,
      purchases: {
        items: {
          paid_full: {
            product: '$root.products.items.paid_full'
          }
        }
      }
    }
  }

  const app = {
    collection: {
      $: '$root.user.purchases.items.$any',
      child: {
        $: 'product',
        text: {
          $: 'title'
        }
      }
    }
  }
  const node = render(app, state)
  t.equal(
    parse(node),
    '<div><div><div>Paid Full</div></div></div>',
    'intial subscription'
  )
  t.end()
})

test('any - reference change', function (t) {
  const state = s({
    holder: {
      fields: {
        items: [ 1, 2 ]
      },
      fields2: {
        items: [ 3, 4 ]
      },
      current: '$root.holder.fields'
    }
  })

  var app = render({
    $: 'holder.current',
    page: {
      $: 'items.$any',
      child: {
        text: { $: true }
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>1</div>
          <div>2</div>
        </div>
      </div>
    `)
  )

  state.holder.current.set(state.holder.fields2)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>
          <div>3</div>
          <div>4</div>
        </div>
      </div>
    `)
  )

  t.end()
})
