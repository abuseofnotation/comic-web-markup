import {createElement} from './helpers.js'
import {renderTextBalloon} from './renderTextBalloon.js'
import {renderImage} from './renderImage.js'

const debug = true

const svg = createElement('svg')
const link = createElement('link', 'http://www.w3.org/1999/xhtml' )
const rect = createElement('rect')

export const render = (objects, {urlDir, fileType, width, height}) => {

  const balloons = objects
    .filter((object) => object.text !== undefined)
    .reduce(renderTextBalloon({frameWidth: width, frameHeight: height}), [])

  const images = objects
    .reduce(renderImage({frameWidth: width, frameHeight: height, urlDir, balloons, fileType} ), [])

  return svg({ width, height, class:'comic-web-panel'}, 
    [rect({width, height, class:'background'})]
    .concat([link({
      rel: 'stylesheet',
      href: urlDir + '/style.css',
      type: "text/css",
    })])
    .concat(images)
    .concat(balloons)
    .concat([rect({width, height, class: 'panel-frame'})])
    
  )
}


