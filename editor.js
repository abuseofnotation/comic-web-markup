import {renderComic} from './lib/index.js'

const update = () => {
  //TODO show available resources
  //fetch(https://api.github.com/repos/abuseofnotation/comic-web-markup/git/trees/main?recursive=1)
  const comic = document.getElementById('comic')
  const script = document.getElementById('script').value.split('* * *')
  comic.replaceChildren(...script.map((panel) => renderComic(panel, "comic")))
}
document.getElementById('script').addEventListener('input', update)
update()
