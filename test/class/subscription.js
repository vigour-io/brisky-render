import { create as s } from 'brisky-struct'
import test from 'tape'
import { render } from '../../'
import strip from 'strip-formatting'
import parse from 'parse-element'

test('subscription - any + $switch - class false', t => {
  const state = s({
    todos: {
      1: { text: 'hello 1' },
      2: { text: 'hello 2', done: true }
    }
  })

  const app = render({
    todos: {
      tag: 'fragment',
      $: 'todos.$any',
      props: {
        default: {
          text: { $: 'text' },
          class: {
            val: 'todo',
            done: { $: 'done' },
            party: {
              $: 'text.$switch',
              $switch: val => val.compute().indexOf('party') !== -1,
              $transform: val => val && true || false
            }
          }
        }
      }
    }
  }, state)

  state.todos[1].set({ text: 'party boys' })

  t.same(
    parse(app),
    strip(`
      <div>
        <div class="todo party">party boys</div>
        <div class="todo done">hello 2</div>
      </div>
    `),
    'initial subcription'
  )

  state.todos[1].text.set('hello')
  t.same(
    parse(app),
    strip(`
      <div>
        <div class="todo">hello</div>
        <div class="todo done">hello 2</div>
      </div>
    `),
    'set text'
  )
  t.end()
})
