import {renderComic} from './index.js'

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("panel"))
panels.forEach((panel) => {
  if (panel.height < 40) {
    const svgPanel= renderComic(panel.alt, panel.src)
    panel.replaceWith(svgPanel)
  } else {
  panel.addEventListener('error', () => {
    const svgPanel= renderComic(panel.alt, panel.src)
    panel.replaceWith(svgPanel)
  });
  }
})
