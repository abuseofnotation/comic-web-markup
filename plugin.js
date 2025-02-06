import {renderComic} from './lib/index.js'

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("panel"))
panels.forEach((panel) => {
  const urlDir = panel.src.split('/').slice(0, -1).join('/')
  if (panel.height < 100) { // When the image isn't loaded
    const svgPanel= renderComic(panel.alt, urlDir)
    panel.replaceWith(svgPanel)
  } else {
  panel.addEventListener('error', () => {
    const svgPanel= renderComic(panel.alt, urlDir)
    panel.replaceWith(svgPanel)
  });
  }
})
