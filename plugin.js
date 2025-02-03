import {renderComic} from './lib/index.js'

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("panel"))
panels.forEach((panel) => {
  const urlDir = panel.src.split('/').slice(0, -1).join('/')
  if (panel.height < 40) {
    const svgPanel= renderComic(panel.alt, urlDir)
    panel.replaceWith(svgPanel)
  } else {
  panel.addEventListener('error', () => {
    console.log({urlDir})
    const svgPanel= renderComic(panel.alt, urlDir)
    panel.replaceWith(svgPanel)
  });
  }
})
