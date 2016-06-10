'use strict'
const render = require('../../render')
const test = require('tape')
const parse = require('parse-element')
const s = require('vigour-state/s')
const getParent = require('../../lib/render/dom/parent')
const emos = require('../util/emojis')
const vstamp = require('vigour-stamp')
test('group - no done', function (t) {
  var string = ''

  const state = s({
    thing: {
      one: 'A',
      two: 'B',
      three: 'C'
    }
  })

  const elem = render({
    properties: {
      randomGroup: {
        type: 'group',
        render: {
          static (target, node) {
            const val = target.compute()
            string = target.storeStatic(val, node)
          },
          state (target, state, type, stamp, subs, tree, id, pid) {
            const val = state && target.$ ? target.compute(state) : target.compute()
          }
        },
        child: {
          define: {
            collect (val, store, id) {
              const _ = store._ || (store._ = {})
              const index = _[id] || (_[id] = store.length + 1)
              store[index] = val ? typeof val === 'string' ? val : this.key : ''
            }
          },
          render: {
            static (target, node, store) {
              target.collect(target.compute(), store, target.uid())
            },
            state (target, state, type, stamp, subs, tree, id, pid) {
              const store = target.getStore(tree, pid + 'random')
              console.log('state child', store.stamp, stamp)
              if (!store.stamp && store.stamp !== 0) {
                vstamp.on(stamp, function () {
                  console.log('fire!', stamp)
                  const val = '' // should be parent value
                  string = target.cParent().storeState(val, state, type, stamp, subs._.p, tree._p, pid + 'random', pid)
                  store.stamp = null
                  console.log('string:', string)
                })
                // setTimeout(function () {
                //   console.log('close!', stamp)
                //   vstamp.close(stamp)
                // })
                store.stamp = stamp
              }
              target.collect(target.compute(state), store, id)
            }
          }
        }
      }
    },
    $: 'thing',
    randomGroup: {
      a: { $: 'one' },
      b: { $: 'two' },
      c: { $: 'three' }
    }
  }, state)


  setTimeout(function () {
    console.log('--- update ---')
    state.set({
      thing: {
        one: 'hey'
      }
    })

    // t.equals(string, 'a b c', 'static group')
    setTimeout(function () {
      t.end()
    }, 50)
  }, 10)
})

// test('group', function (t) {
//   const types = {
//     animation: {
//       type: 'group',
//       properties: {
//         style: true,
//         template: true
//       },
//       render: {
//         static (target, node) {
//           node.style.position = 'fixed'
//           node.style[target.style] = target.template
//         },
//         state (target, state, type, stamp, subs, tree, id, pid) {
//           var val = state && target.$ ? target.compute(state) : target.compute()
//           const stored = target.storeState(void 0, state, type, stamp, subs, tree, pid + 'animation', pid, true)
//           const node = getParent(type, stamp, subs, tree, pid)
//           const keys = Object.keys(stored)
//           val = (target.template || val)
//             .replace('{0}', stored[keys[0]])
//             .replace('{1}', stored[keys[1]])
//             .replace('{2}', stored[keys[2]])
//           node.style.position = 'fixed'
//           node.style[target.style] = val
//         }
//       },
//       child: {
//         define: {
//           collect (val, store, id) {
//             const _ = store._ || (store._ = {})
//             const index = _[id] || (_[id] = store.length + 1)
//             store[index] = val
//           }
//         },
//         render: {
//           state (target, state, type, stamp, subs, tree, id, pid) {
//             target.collect(target.compute(state), target.getStore(tree, pid + 'animation'), id)
//           }
//         }
//       }
//     }
//   }

//   const arr = []
//   for (let i = 0; i < 2; i++) {
//     arr.push(i)
//   }

//   const state = global.state = s(arr)

//   var max = 350

//   types.poocircle = {
//     $: '$any',
//     animation: {
//       type: 'animation',
//       style: 'transform',
//       template: 'translate(0px,1px)'
//     },
//     child: {
//       tag: 'span',
//       $: '$test',
//       $test: (state) => state[0] && state[0].compute() > max / 2,
//       title: {
//         tag: 'h1',
//         $: 'title',
//         text: { $: true }
//       },
//       animation: {
//         type: 'animation',
//         style: 'transform',
//         template: 'translate3d({0}px,{1}px, 0px) rotate({2}deg)',
//         0: { $: 0 },
//         1: { $: 1 },
//         2: { $: 2 }
//       }
//     }
//   }

//   const app = render(
//     {
//       types,
//       collection: {
//         $: '$any',
//         child: {
//           type: 'poocircle'
//         }
//       },
//       speshcollesh: {
//         type: 'poocircle',
//         $: '0.$any',
//         child: {
//           animation: {
//             0: { $transform: (val) => val * 2.5 - 0.75 * max },
//             1: { $transform: (val) => val * 2.5 - 1.5 * max }
//           }
//         }
//       }
//     },
//     state
//   )

//   function update (cnt, field) {
//     const set = {}
//     const d = Math.ceil(65 / emos.moons.length)
//     for (let i = 1; i < 65; i++) {
//       set[i] = {
//         title: emos.moons[(i / d) | 0],
//         0: Math.cos((i + cnt) / 10) * (max / 2 * (1.1 * field + 2.1)) + max / 2,
//         1: Math.sin((i + cnt) / 10) * (max / 2 * (1.1 * field + 2.1)) + max,
//         2: cnt * 100 + i
//       }
//     }
//     state[field].set(set)
//   }

//   // const html = `
//   //   <!doctype html>
//   //   <html lang="en">
//   //   <head>
//   //     <meta charset="utf-8">
//   //   </head>
//   //   <body>
//   //   {app}
//   //   </body>
//   //   </html>
//   // `
//   const path = require('path')
//   const fs = require('fs')
//  // fs.writeFile(path.join(__dirname, 'output.html'), html.replace('{app}', parse(app)))
//   const output = fs.readFileSync(path.join(__dirname, 'output.html'), 'utf-8')
//   var cnt = 30
//   function loop () {
//     cnt++
//     state.each((p, key) => {
//       update(cnt / 20, key)
//     })
//   }
//   loop()
//   if ('body' in document) {
//     document.body.appendChild(app)
//   }
//   t.same(parse(app), output, 'group outputs correct html')
//   t.end()
// })
