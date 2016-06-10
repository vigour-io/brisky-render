'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const emos = require('../util/emojis')

test('group', function (t) {
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
        state (target, state, type, stamp, subs, tree, id, pid, store) {
          var val = state && target.$ ? target.compute(state) : target.compute()
          const node = getParent(type, stamp, subs, tree, pid)
          val = (target.template || val)
          for (let key in store) {
            val = val.replace(`{${key}}`, store[key])
          }
          // target.template.replace('{x}', store.x).
          node.style.position = 'fixed'
          node.style[target.style] = val
        }
      }
    }
  }

  const arr = []
  for (let i = 0; i < 2; i++) {
    arr.push(i)
  }

  const state = global.state = s(arr)

  var max = 350

  types.poocircle = {
    $: '$any',
    animation: {
      type: 'animation',
      style: 'transform',
      template: 'translate(0px,1px)'
    },
    child: {
      tag: 'span',
      // $: '$test',
      // $test: (state) => state[0] && state[0].compute() > max / 2,
      title: {
        tag: 'h1',
        $: 'title',
        text: { $: true }
      },
      animation: {
        type: 'animation',
        style: 'transform',
        template: 'translate3d({x}px,{y}px, 0px) rotate({rotate}deg)',
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

  // const html = `
  //   <!doctype html>
  //   <html lang="en">
  //   <head>
  //     <meta charset="utf-8">
  //   </head>
  //   <body>
  //   {app}
  //   </body>
  //   </html>
  // `
  const path = require('path')
  const fs = require('fs')
 // fs.writeFile(path.join(__dirname, 'output.html'), html.replace('{app}', parse(app)))
  // const output = 'body' in document ? '' : fs.readFileSync(path.join(__dirname, 'output.html'), 'utf-8')
  var cnt = 30
  function loop () {
    cnt++
    state.each((p, key) => {
      update(cnt / 20, key)
    })
    setTimeout(loop, 100)
  }
  loop()
  if ('body' in document) {
    document.body.appendChild(app)
  }
  // t.same(parse(app), output, 'group outputs correct html')
  // t.end()
})
