import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'
import strip from 'strip-formatting'
import { create as s } from 'brisky-struct'

test('any - basic', t => {
  const app = {
    holder: {
      $: 'collection.$any',
      props: {
        default: {
          tag: 'span',
          title: { text: { $: 'title' } }
        }
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

  state.collection[0].set(null)
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

  const ss = s({
    collection: [
      { title: 'b' }
    ]
  })

  const x = render({
    types: {
      span: {
        tag: 'span',
        title: { text: { $: 'title' } }
      },
      collection: {
        $: 'collection.$any',
        props: { default: { type: 'span' } }
      }
    },
    holder: { type: 'collection' }
  }, ss)

  t.equal(
    parse(x),
    '<div><div><span><div>b</div></span></div></div>',
    'context render'
  )

  t.end()
})

test('any - reference', t => {
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
            product: [ '@', 'root', 'products', 'items', 'paid_full' ]
          }
        }
      }
    }
  }

  const app = {
    collection: {
      $: 'root.user.purchases.items.$any',
      props: {
        default: {
          $: 'product',
          text: { $: 'title' }
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

test('any - reference change', t => {
  const state = s({
    holder: {
      fields: {
        items: [ 1, 2 ]
      },
      fields2: {
        items: [ 3, 4 ]
      },
      current: [ '@', 'root', 'holder', 'fields' ]
    }
  })

  var app = render({
    $: 'holder.current',
    page: {
      $: 'items.$any',
      props: {
        default: { text: { $: true } }
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

test('any - non path deep', t => {
  const state = s({
    a: 'a',
    b: 'b'
  })

  var app = render({
    $: '$any',
    props: {
      default: {
        text: 'lullz'
      }
    }
  }, state)

  t.same(
    parse(app),
    strip(`
      <div>
        <div>lullz</div>
        <div>lullz</div>
      </div>
    `)
  )

  t.end()
})
