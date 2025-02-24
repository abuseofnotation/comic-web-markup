import {renderComic} from './lib/index.js'

const getConfig = (imageConfig) => {
  const el = document.getElementById("comic-web")
  const config = el ? el.dataset : {}
  //The if no URL for resources is specified, use the image src 
  const urlDir =  imageConfig.urlDir || config.urlDir || panel.src.split('/').slice(0, -1).join('/')
  const fileType = imageConfig.fileType || config.fileType || panel.src.split('.').at(-1)
  const width = imageConfig.width || config.width || 500
  const height = imageConfig.height || config.height || 500
  const textSize = imageConfig.textSize || config.textSize || 15
  return {urlDir, fileType, width, height, textSize}
}

window.comicWebRender = (text) => renderComic(text, getConfig({}))

const panels = 
Array.prototype.slice.call(document.getElementsByClassName("comic-web-panel"))
panels.forEach((panel) => {

  if (panel.height < 100) { // When the image isn't loaded
    panel.replaceWith(renderComic(panel.alt, getConfig(panel.dataset)))
  } else {
  panel.addEventListener('error', () => {
    panel.replaceWith(renderComic(panel.alt, getConfig(panel.dataset)))
  });
  }
})
