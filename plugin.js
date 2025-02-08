import {renderComic} from './lib/index.js'

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("comic-web-panel"))
panels.forEach((panel) => {

  const el = document.getElementById("comic-web")
  const config = el ? el.dataset : {}
  //The if no URL for resources is specified, use the image src 
  const imageConfig = panel.dataset
  const urlDir =  imageConfig.urlDir || config.urlDir || panel.src.split('/').slice(0, -1).join('/')
  const fileType = imageConfig.fileType || config.fileType || panel.src.split('.').at(-1)
  const width = imageConfig.width || config.width || 500
  const height = imageConfig.height || config.height || 500
  const textSize = imageConfig.textSize || config.textSize || 15

  const comic = () => renderComic(panel.alt, {urlDir, fileType, width, height, textSize})

  if (panel.height < 100) { // When the image isn't loaded
    panel.replaceWith(comic())
  } else {
  panel.addEventListener('error', () => {
    panel.replaceWith(comic())
  });
  }
})
