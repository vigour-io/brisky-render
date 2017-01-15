const test = require('tape')
const { render } = require('../../')
const p = require('parse-element')
// note: html-element handles attributes a bit weird (https://github.com/1N50MN14/html-element/issues/23)

// test('static', t => {
//   var elem, attr1, attr2
//   elem = render({
//     attr: {
//       someattribute: true
//     }
//   })
//   attr1 = elem.getAttribute('someattribute')
//   t.ok(attr1 === 'true', 'simple attribute')
//   elem = render({
//     attr: {
//       someattribute: false,
//       anotherattribute: true
//     }
//   })
//   attr1 = elem.getAttribute('someattribute')
//   attr2 = elem.getAttribute('anotherattribute')
//   t.ok(
//     attr1 === 'false' &&
//     attr2 === 'true'
//     , 'multiple attributes')
//   t.ok(!elem.getAttribute('type'), 'doesn\'t include type')
//   t.end()
// })

test('static - value', t => {
  const app = render({
    slider: {
      tag: 'input',
      attr: {
        type: 'slider',
        value: '10'
      }
    }
  }, void 0, (subs, tree, app) => {
    // console.log(app.get('props').attr.struct.props.default)
  })
  t.equal(p(app), '<div><input type="slider"></div>', 'type slider (type override)')
  t.same(app.childNodes[0].value, '10', 'has correct value')
  t.end()
})

// test('static - remove', t => {
//   const app = render({
//     types: {
//       field: {
//         attr: {
//           someattribute: true
//         }
//       }
//     },
//     field: {
//       type: 'field',
//       attr: {
//         someattribute: (val, t) => t
//       }
//     }
//   })
//   t.equal(p(app), '<div><div></div></div>', 'remove static attribute (equals target)')
//   t.end()
// })
