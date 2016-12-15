import { render } from '../../'
import test from 'tape'
import parse from 'parse-element'
import { create as s } from 'brisky-struct'
import strip from 'strip-formatting'

test('switch - branch', t => {
  const state = s({ field: { navigation: {} } })
  var app = render(
    {
      holder: {
        tag: 'holder',
        switcher: {
          $: 'field.navigation.$switch',
          $switch: state => state.origin().key,
          props: {
            first: {
              tag: 'first',
              text: { $: 'title' }
            },
            second: {
              tag: 'second',
              text: { $: 'rating' }
            }
          }
        },
        second: {
          tag: 'switchsecond',
          $: 'field',
          switcher: {
            $: 'navigation.$switch',
            $switch: state => state.origin().key,
            props: {
              first: {
                tag: 'first',
                text: { $: 'title' }
              },
              second: {
                tag: 'second',
                text: { $: 'rating' }
              }
            }
          }
        }
      },
      holder2: {
        tag: 'holder2',
        $: 'field',
        field: {
          $: 'navigation',
          switcher: {
            $: '$switch',
            $switch: state => state.origin().key,
            props: {
              first: {
                tag: 'first',
                text: { $: 'title' }
              },
              second: {
                tag: 'second',
                text: { $: 'rating' }
              }
            }
          }
        }
      }
    },
    state
  )

  t.equal(
    parse(app),
    strip(`
      <div>
        <holder>
          <switchsecond>
          </switchsecond>
        </holder>
        <holder2>
          <div>
          </div>
        </holder2>
      </div>
    `),
    'intial'
  )

  state.set({
    items: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    field: {
      navigation: [ '@', 'root', 'items', 'first' ]
    }
  })

  t.equal(
    parse(app),
    strip(`
      <div>
        <holder>
          <first>first</first>
          <switchsecond>
            <first>first</first>
          </switchsecond>
        </holder>
        <holder2>
          <div>
            <first>first</first>
          </div>
        </holder2>
      </div>
    `),
    'switch navigation to items[0]'
  )

  state.field.navigation.set([ '@', 'root', 'items', 'second' ])
  t.equal(
    parse(app),
     strip(`
      <div>
        <holder>
          <second>100</second>
          <switchsecond>
            <second>100</second>
          </switchsecond>
        </holder>
        <holder2>
          <div>
            <second>100</second>
          </div>
        </holder2>
      </div>
    `),
    'switch navigation to items[1]'
  )
  t.end()
})
