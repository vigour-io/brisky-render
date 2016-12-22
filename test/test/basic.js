import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'

test('$switch (test) - basic', t => {
  var elem = render({
    holder: {
      $: 'collection.$any',
      props: {
        default: {
          $: '$switch',
          $switch: {
            val (state) {
              return state.title.compute() === 'a'
            },
            $: {
              title: {}
            }
          }
        }
      }
    }
  }, {
    collection: [
      { title: 'a' },
      { title: 'b' },
      { title: 'c' }
    ]
  })

  t.equal(
    elem.childNodes[0].childNodes.length,
    1,
    'simple test collection + test'
  )

  elem = render({
    $: 'thing',
    item: {
      tag: 'blurf',
      $: '$switch',
      $switch: {
        val: state => state.title.compute() === 'a',
        title: true
      }
    }
  }, {
    thing: { title: 'a' }
  })

  t.equal(
    elem.childNodes.length,
    1,
    'simple test'
  )

  elem = render({
    item: {
      $: 'nested.thing.$switch',
      $switch: {
        val (state) {
          return state.title.compute() === 'a'
        },
        $: {
          title: {}
        }
      }
    }
  }, {
    nested: {
      thing: { title: 'a' }
    }
  })

  t.equal(
    elem.childNodes.length,
    1,
    'simple test nested'
  )

  elem = render({
    holder: {
      text: 'holder',
      $: 'thing',
      item: {
        text: 'item',
        $: '$switch',
        $switch: {
          val: (state) => {
            return state.title.compute() === 'b' &&
              state.root().nested.rootthing.title.compute() === 'a'
          },
          $: {
            root: {
              nested: {
                rootthing: {}
              }
            }
          }
        },
        title: {
          text: { $: 'title' }
        }
      }
    }
  }, {
    thing: {
      title: 'b'
    },
    nested: {
      rootthing: { title: 'a' }
    }
  })

  t.equal(
    parse(elem),
    '<div><div>holder<div>item<div>b</div></div></div></div>',
    'simple test nested +  root'
  )

  elem = render({
    holder: {
      text: 'holder',
      $: 'thing',
      item: {
        text: 'item',
        $: '$switch',
        $switch: {
          val: state => {
            return state.title.compute() === 'b' &&
              state.root().nested.rootthing.title.compute() === 'a'
          },
          $: {
            root: {
              nested: {
                rootthing: true
              }
            }
          }
        },
        title: {
          text: { $: 'title' }
        }
      }
    }
  }, {
    thing: {
      title: 'b'
    },
    nested: {
      rootthing: { title: 'a' }
    }
  })

  t.equal(
    parse(elem),
    '<div><div>holder<div>item<div>b</div></div></div></div>',
    'simple test nested +  root'
  )

  t.end()
})

test('$switch (test) - override test from type', t => {
  // use type and
  render({
    types: {
      thing: {
        text: { $: 'bla.$switch' }
      }
    },
    jur: {
      type: 'thing',
      text: { $: 'a' }
    }
  }, {}, (subs) => {
    t.equal(subs.a._.tList[3].$switch, null, 'should be null')
  })
  t.end()
})
