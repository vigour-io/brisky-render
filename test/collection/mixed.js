'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')

test('collection - mixed', function (t) {
  const state = s({
    field: {
      collection: {
        0: {
          title: '0'
        }
      }
    }
  })

  const app = render({
    main: {
      holder1: {
        tag: 'holder',
        $: 'field.collection.$any',
        child: {
          class: 'basic-item',
          text: { $: 'title' }
        }
      },
      holder2: {
        tag: 'holder2',
        $: 'field.collection.0',
        title: {
          text: { $: 'title' }
        }
      }
      // holder3: {
      //   tag: 'holder3',
      //   $: 'collection.$any',
      //   child: {
      //     class: 'basic-item',
      //     text: { $: 'title' }
      //   }
      // }
    }
  }, state)

  console.log(parse(app))
  document.body.appendChild(app)

  t.end()
})

/*
  header: {
    a: {
      bla: {
        x: {
          text: { $: 'x', $prepend: 'x:' }
        },
        lastname: {
          text: {
            $: 'title.lastname',
            $prepend: 'lname: '
          }
        }
      },
      text: {
        $: 'title',
        $prepend: 'h:',
        $transform (val) { return val }
      }
    }
  }
*/
