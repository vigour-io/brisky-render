'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const emos = require('../util/emojis')
const fs = require('fs')
const path = require('path')

test('group - combined', function (t) {
  const types = {
    animation: {
      type: 'group',
      properties: {
        style: true,
        template: true
      },
      render: {
        static (target, node, store) {
          node.style.position = 'fixed'
          node.style[target.style] = target.template
        },
        state (target, s, type, stamp, subs, tree, id, pid, store) {
          var val = s && target.$ ? target.compute(s) : target.compute()
          const node = getParent(type, stamp, subs, tree, pid)
          val = (target.template || val)
          for (let key in store) {
            val = val.replace(`{${key}}`, store[key])
          }
          node.style.position = 'fixed'
          node.style[target.style] = val
        }
      }
    }
  }

  const arr = []
  for (let i = 0; i < 20; i++) {
    arr.push(i)
  }

  const state = global.state = s(arr)

  var max = 350

  types.poocircle = {
    $: '$any',
    animation: {
      type: 'animation',
      style: 'transform',
      template: 'translate(0px, 1px)'
    },
    child: {
      tag: 'span',
      $: '$test',
      $test: (state) => {
        const x = state[0] && state[0].compute()
        const y = state[1] && state[1].compute()
        return x > max / 2 && y > max / 2
      },
      title: {
        tag: 'h1',
        $: 'title',
        text: { $: true }
      },
      animation: {
        type: 'animation',
        style: 'transform',
        template: 'translate3d({x}px, {y}px, 0px) rotate({rotate}deg)',
        x: { $: 0 },
        y: { $: 1 },
        rotate: { $: 2 }
      }
    }
  }

  const app = render(
    {
      types,
      collection: {
        $: '$any',
        child: {
          type: 'poocircle'
        }
      },
      speshcollesh: {
        type: 'poocircle',
        $: '0.$any',
        child: {
          animation: {
            x: { $transform: (val) => val * 2.5 - 0.75 * max },
            y: { $transform: (val) => val * 2.5 - 1.5 * max }
            // rotate: 360 // does not work for static...
          }
        }
      }
    },
    state
  )

  function update (cnt, field) {
    const set = {}
    const d = Math.ceil(65 / emos.moons.length)
    for (let i = 1; i < 65; i++) {
      set[i] = {
        title: emos.moons[(i / d) | 0],
        0: Math.cos((i + cnt) / 10) * (max / 2 * (1.1 * field + 2.1)) + max / 2,
        1: Math.sin((i + cnt) / 10) * (max / 2 * (1.1 * field + 2.1)) + max,
        2: cnt * 100 + i
      }
    }
    state[field].set(set)
  }

  var cnt = 30
  function loop () {
    cnt++
    state.each((p, key) => update(cnt / 20, key))
  }
  loop()
  if ('body' in document) {
    document.body.appendChild(app)
  } else {
    const output = fs.readFileSync(path.join(__dirname, '/output.html'))
    t.equal(parse(app), output.toString(), 'correct output')
  }
  t.end()
})
