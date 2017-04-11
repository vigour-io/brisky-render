const { render } = require('../')
const test = require('tape')
const { struct } = require('brisky-struct')
const parse = require('parse-element')
const pretty = require('pretty')

test('clone - reuse ', t => {
  const movie1 = { title: 'movie1' }
  const movie2 = { title: 'movie1' }
  const show1 = { title: 'show1' }
  const show2 = { title: 'show2' }

  const s = struct.create({
    page: {
      movie1,
      movie2,
      show1,
      show2,
      shows: {
        title: 'shows',
        items: [
          [ '@', 'root', 'page', 'show1' ],
          [ '@', 'root', 'page', 'show2' ]
        ]
      },
      movies: {
        title: 'movies',
        items: [
          [ '@', 'root', 'page', 'movie1' ],
          [ '@', 'root', 'page', 'movie2' ]
        ]
      },
      search: {
        shows: {
          order: 0,
          val: [ '@', 'root', 'page', 'shows' ]
        },
        movies: {
          order: 1,
          val: [ '@', 'root', 'page', 'movies' ]
        }
      }
    },
    search: {}
  })

  // ---
  const app = render({
    search: {
      $: 'page.current',
      fields: {
        $: '$any',
        // $: 'shows',
        props: {
          default: {
            tag: 'ul',
            $: 'items.$any',
            $any: {
              root: {
                search: {
                  query: true
                }
              },
              title: true,
              val: (keys, s) => keys.filter(key => {
                const q = s.root().get([ 'search', 'query', 'compute' ])
                if (q && (s.get([ key, 'title', 'compute' ]) || '').indexOf(q) !== -1) {
                  return true
                }
              })
            },
            props: {
              default: {
                tag: 'li',
                text: { $: 'title' }
              }
            }
          }
        }
      }
    }
  }, s)

  s.set({
    page: {
      current: [ '@', 'root', 'page', 'search' ]
    }
  })

  s.set({
    search: { query: '1' }
  })

  console.log(pretty(parse(app)))
  // const path = []
  // sInstance.subscribe({
  //   page: {
  //     current: {
  //       $any: {
  //         items: {
  //           $any: {
  //             $keys: {
  //               root: { search: { query: true } },
  //               title: true,
  //               val: (keys, s) => keys.filter(key => {
  //                 const q = s.root().get([ 'search', 'query', 'compute' ])
  //                 if (q && (s.get([ key, 'title', 'compute' ]) || '').indexOf(q) !== -1) {
  //                   return true
  //                 }
  //               })
  //             },
  //             val: true
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, (val, type) => {
  //   path.push(val.path())
  // })
})
