import {render} from './render.js'
import {parse} from './parse.js'

const pipe = (...f) => (arg, config)=> f.reduce((res, f) => f(res, config), arg)

export const renderComic = pipe(parse, render)

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("panel"))
console.log(panels)
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
