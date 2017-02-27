const { render } = require('../../')
const test = require('tape')
const parse = require('parse-element')
const { create: s } = require('brisky-struct')
const strip = require('strip-formatting')

test('fragment - any - order', t => {
  const state = s({
    list: [ 1, 2, 3, 4, 5 ]
  })

  const app = {
    tag: 'ul',
    child0: {
      tag: 'h1',
      child0: {
        type: 'text',
        val: `header`
      }
    },
    child1: {
      tag: 'fragment',
      $: 'list.$any',
      props: {
        default: {
          tag: 'li',
          child0: {
            type: 'text',
            $: true
          }
        }
      }
    },
    child2: {
      text: `footer`
    }
  }

  const result = strip(`
    <ul>
     <h1>header</h1>
     <li>1</li>
     <li>2</li>
     <li>3</li>
     <li>4</li>
     <li>5</li>
     <div>footer</div>
    </ul>
  `)

  t.equal(parse(render(app, state)), result)

  t.end()
})
