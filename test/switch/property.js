const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const strip = require('strip-formatting')

test('switch - property', t => {
  const app = render(
    {
      switcher: {
        randomProp: {
          type: 'property',
          render: {
            static (target, node) {
              node.appendChild(document.createElement('random'))
            }
          }
        },
        $: 'root.random',
        $switch: () => true
      }
    },
    {
      random: true
    }
  )

  t.equal(
    parse(app),
     strip(`
      <div>
        <div>
          <random>
          </random>
        </div>
      </div>
    `),
    'renders static property'
  )

  t.end()
})
