import {renderComic} from './lib/index.js'

const update = () => {
  const comic = document.getElementById('comic')
  const script = document.getElementById('script').value.split('* * *')
  comic.replaceChildren(...script.map((panel) => renderComic(panel, "comic")))
}
document.getElementById('script').addEventListener('input', update)
update()
