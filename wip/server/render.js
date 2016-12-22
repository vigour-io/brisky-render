import { render } from 'brisky-render'
import parse from 'parse-element'

export default (body, state) => {
  if (typeof window === 'undefined') {
    const elem = render(body, state)
    return `<html>
      <body>
        <div id='pre-render-remove'>${parse(elem)}</div>
        ${global.styletron.getStylesheetsHtml()}
        <script src="build.js"></script>
      </body>
      </html>`
  } else {
    setTimeout(() => {
      document.body.removeChild(document.getElementById('pre-render-remove'))
      document.body.appendChild(render(body, state))
    }, 1000)
  }
}
