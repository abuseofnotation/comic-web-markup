import {renderComic} from './lib/index.js'

document.getElementById('script').addEventListener('input', (e) => {
  const comic = document.getElementById('comic')
  const script = e.target.value.split('* * *')
  comic.replaceChildren(...script.map((panel) => renderComic(panel, "generic-comics/")))
})
