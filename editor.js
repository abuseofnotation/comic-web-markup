import {renderComic} from './index.js'
document.getElementById('script').addEventListener('input', (e) => {
  const comic = document.getElementById('comic')
  const script = e.target.value
  comic.replaceChildren(renderComic(script, "comics/"))
})
