import { property, element } from '../../../static'
import fragment from './fragment'
import { tag } from '../../../../get'

const style = (t, ctx, width, height) => {
  // padding, margin, top, left, position, border
  if (t.style.background) {
    ctx.fillStyle = t.style.background
    ctx.fillRect(0, 0, width, height)
  }

  if (t.style.image) {
    if (!t._img || t.style.image !== t._imgUrl) {
      t._imgUrl = t.style.image
      t._img = new global.Image()
      t._img.src = t.style.image
      t._loaded = false
      t._img.onload = () => {
        t._loaded = true
        t.requestPaint()
      }
    }
    if (t._loaded) {
      const size = t.style.backgroundSize
      if (!size) {
        ctx.drawImage(t._img, 0, 0, t._img.width, t._img.height)
      } else {
        if (size === 'cover') {
          // center by default
          var ratio = width / t._img.width
          var h = t._img.height * ratio
          var x = 0
          var y = 0
          y = (height - h) / 2
          var w = width
          if (h < height) {
            ratio = height / t._img.height
            h = height
            w = t._img.width * ratio
            y = 0
            x = (width - w) / 2
          }
          ctx.drawImage(t._img, x, y, w, h)
        } else {
          const ratio = width / t._img.width
          // split width and height
          // also add position
          ctx.drawImage(t._img, 0, 0, width, t._img.height * ratio)
        }
      }
    }
  }

  if (t.style.border) {
    // cache all these string operations
    console.log('go make a border?', width, height)
    const match = t.style.border.match(/^(\d)+[a-z]+ [a-z]+ (.+)/)
    ctx.lineWidth = match[1]
    ctx.strokeStyle = match[2]
    ctx.strokeRect(0, 0, width, height)// for white background
  }
}

class Base extends global.Canvas {
  onresize () {

  }
  oncontextlost () {
    this.cx = undefined
  }
  onload () {
    this.cx = this.getContext('2d')
  }
  setText (val, id) {
    // multiple text nodes id
    this.text = val
    // if there is a width calc everything
    this.requestPaint()
  }
  onpaint () {
    const ctx = this.cx
    this.clear()
    const styles = this.style
    if (this.text !== void 0) {
      let { width, height } = this.getDimensions()
      if (styles) {
        style(this, ctx, width, height)
        // font properties (add vertical align middle etc)
        // textAlign center
        ctx.fillStyle = styles.color || 'black'
        ctx.fontSize = styles.fontSize || 12
        ctx.fontFamily = styles.fontFamily || 'Verdana'
      } else {
        ctx.fillStyle = 'black' // inheritance :/
      }

      // add lineheight as well
      let lineHeight = (styles && styles.fontSize) || 12

      if (styles && (
        styles.paddingTop ||
        styles.paddingLeft ||
        styles.paddingBottom ||
        styles.paddingRight
      )) {
        const x = styles.paddingLeft || 0
        const y = styles.paddingTop || 0
        const data = ctx.breakText(this.text, width - (styles.paddingLeft || 0) - (styles.paddingRight || 0))
        if (!(styles.height)) {
          // repaint issue fix later...
          this.height = height = lineHeight * (data.lines.length + 1)
        }
        for (let i = 0; i < data.lines.length; i++) {
          ctx.fillText(data.lines[i], x, (i + 1) * lineHeight + y)
        }
      } else {
        const data = ctx.breakText(this.text, width)
        if (!(styles && styles.height)) {
          // repaint issue fix later...
          this.height = height = lineHeight * (data.lines.length + 1)
        }
        for (let i = 0; i < data.lines.length; i++) {
          ctx.fillText(data.lines[i], 0, (i + 1) * lineHeight)
        }
      }
    } else {
      if (styles) {
        const { width, height } = this.getDimensions()
        style(this, ctx, width, height)
      }
    }
  }
}

const injectable = {}

export default injectable

injectable.state = (t, type, subs, tree, id, pnode, state) => {
  const nodeType = tag(t)
  if (nodeType === 'fragment') {
    return fragment(t, pnode, id, tree)
  } else {
    const node = new Base()
    property(t, node)
    element(t, node)
    tree._[id] = node
    return node
  }
}

injectable.static = t => {
  // const nodeType = tag(t)
  const node = new Base()
  property(t, node)
  element(t, node)
  return node
}

