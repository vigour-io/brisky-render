'use strict'
const render = require('../../render')
const test = require('tape')
const parseElement = require('parse-element')

test('$test - basic', function (t) {
  var elem = render({
    holder: {
      $: 'collection.$any',
      child: {
        $: '$test',
        $test: {
          val (state) {
            return state.title.compute() === 'a'
          },
          $: {
            title: {}
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
      $: '$test',
      $test: {
        val (state) {
          return state.title.compute() === 'a'
        },
        $: {
          title: {}
        }
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
      $: 'nested.thing.$test',
      $test: {
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
        $: '$test',
        $test: {
          val: (state) => {
            return state.title.compute() === 'b' &&
              state.getRoot().nested.rootthing.title.compute() === 'a'
          },
          $: {
            $root: {
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
    parseElement(elem),
    '<div><div>holder<div>item<div>b</div></div></div></div>',
    'simple test nested +  root'
  )

  elem = render({
    holder: {
      text: 'holder',
      $: 'thing',
      item: {
        text: 'item',
        $: '$test',
        $test: {
          val: (state) => {
            return state.title.compute() === 'b' &&
              state.getRoot().nested.rootthing.title.compute() === 'a'
          },
          $: {
            $root: {
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
    parseElement(elem),
    '<div><div>holder<div>item<div>b</div></div></div></div>',
    'simple test nested +  root'
  )

  t.end()
})
