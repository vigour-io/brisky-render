import ua from 'vigour-ua/navigator'

const add = (state, stamp) => {
  const collection = state.get('collection', {})
  const index = Number(collection.keys()[collection.keys().length - 1]) + 1 || 0
  collection.set({ [index]: index }, stamp)
}

export const body = {
  balls: { text: 'poop' },
  attr: { id: 'app' },
  firefox: {
    text: 'firefox:' + (ua.browser === 'firefox'),
    style: {
      border: '10px solid green'
    }
  },
  chrome: {
    text: 'chrome:' + (ua.browser === 'chrome'),
    style: {
      border: '10px solid blue'
    }
  },
  safari: {
    text: 'safari:' + (ua.browser === 'safari'),
    style: {
      border: '10px solid red'
    }
  },
  mac: {
    text: 'mac:' + (ua.platform === 'mac')
  },
  phone: {
    text: 'phone:' + (ua.device === 'phone')
  },
  desktop: {
    text: 'desktop:' + (ua.device === 'desktop')
  },
  text: global.navigator.userAgent,
  button: {
    text: 'ADD ROW',
    on: {
      click ({ state }, stamp) {
        add(state, stamp)
      }
    }
  },
  pages: {
    switchit: {
      text: 'GO SWITCH',
      on: {
        click ({ state }, stamp) {
          const key = state.page && state.page.origin().key
          state.set({
            page: ['@', 'root', 'pages', key === 'b' ? 'a' : 'b']
          }, stamp)
        }
      }
    },
    page: {
      $: 'page.$switch',
      props: {
        a: {
          text: 'page-a',
          fields: {
            $: 'fields.$any',
            props: {
              default: {
                text: { $: true }
              }
            }
          }
        },
        b: {
          text: '===> page-b <===',
          title: {
            text: { $: 'title' }
          },
          fields: {
            $: 'fields.$any',
            props: {
              default: {
                text: { $: true }
              }
            }
          }
        }
      }
    }
  }
}
