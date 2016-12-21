import { render } from 'brisky-render'
import parse from 'parse-element'

export default (body, state) => {
  const element = render(body, state)
  if (typeof window === 'undefined') {
    return `<html>
      <body>
        <div id='pre-render-remove'>${parse(element)}</div>
        <script src="build.js"></script>
      </body>
      </html>`
  } else {
    setTimeout(() => {
      document.body.removeChild(document.getElementById('pre-render-remove'))
      document.body.appendChild(element)
    }, 1000)
  }
}
