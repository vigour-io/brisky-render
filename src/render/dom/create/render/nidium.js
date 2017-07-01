import { property, element } from '../../../static'
import fragment from './fragment'
import { tag } from '../../../../get'

const style = (t, ctx, width, height, styles) => {
  // padding, margin, top, left, position, border
  if (styles.background) {
    ctx.fillStyle = styles.background
    ctx.fillRect(0, 0, width, height)
  }

  if (styles.image) {
    if (!t._img || styles.image !== t._imgUrl) {
      t._imgUrl = styles.image
      t._img = new global.Image()
      t._img.src = styles.image
      t._loaded = false
      t._img.onload = () => {
        t._loaded = true
        t.requestPaint()
      }
    }
    if (t._loaded) {
      const size = styles.backgroundSize
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

  if (styles.border) {
    // cache all these string operations
    const match = styles.border.match(/^(\d)+[a-z]+ [a-z]+ (.+)/)
    ctx.lineWidth = match[1]
    ctx.strokeStyle = match[2]
    ctx.strokeRect(0, 0, width, height)// for white background
  }
}

const text = (t, ctx, styles) => {
  let { width, height } = t.getDimensions()
  if (styles) {
    style(t, ctx, width, height, styles)
    // font properties (add vertical align middle etc)
    // textAlign center
    ctx.textAlign = styles.textAlign || 'left'
    // width
    ctx.fillStyle = styles.color || 'black'
    ctx.fontSize = styles.fontSize || 12
    ctx.fontFamily = styles.fontFamily || 'Verdana'
  } else {
    ctx.fillStyle = 'black' // inheritance :/ add it
  }

      // add lineheight as well
  let lineHeight = (styles && styles.fontSize) || 12

  if (
    t.paddingTop ||
    t.paddingLeft ||
    t.paddingBottom ||
    t.paddingRight
  ) {
    let x = t.paddingLeft || 0
    if (styles && styles.textAlign && styles.textAlign === 'center') {
      x = width / 2
    }
    const y = t.paddingTop || 0
    const data = ctx.breakText(t.text, width - (t.paddingLeft || 0) - (t.paddingRight || 0))
    if (!t._height) {
      // repaint issue fix later...
      const val = lineHeight * (data.lines.length + 1)
      if (t.height !== val) {
        t.height = val
        return
      }
    }
    for (let i = 0; i < data.lines.length; i++) {
      ctx.fillText(data.lines[i], x, (i + 1) * lineHeight + y)
    }
  } else {
    const data = ctx.breakText(t.text, width)
    let x = 0
    if (styles && styles.textAlign && styles.textAlign === 'center') {
      x = width / 2
    }
    if (!t._height) {
      // repaint issue fix later...
      const val = lineHeight * (data.lines.length + 1)
      if (t.height !== val) {
        t.height = val
        return
      }
    }
    for (let i = 0; i < data.lines.length; i++) {
      ctx.fillText(data.lines[i], x, (i + 1) * lineHeight)
    }
  }
}

class Base extends global.Canvas {
  onresize () {

  }
  getBoundingclientRect () {
    return this.getDimensions()
  }
  get parentNode () {
    return this.getParent()
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
    const styles = this.style
    this.clear()
    if (this.text !== void 0) {
      text(this, ctx, styles)
    } else if (styles) {
      const { width, height } = this.getDimensions()
      style(this, ctx, width, height, styles)
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

