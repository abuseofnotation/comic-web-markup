import {createElement} from './helpers.js'
import {renderTextBalloon} from './renderTextBalloon.js'
import {renderImage} from './renderImage.js'

const debug = true

const frameWidth = 500
const frameHeight = 500

const svg = createElement('svg')
const link = createElement('link', 'http://www.w3.org/1999/xhtml' )

export const render = (objects, urlDir) => {

  const balloons = objects
    .filter((object) => object.text !== undefined)
    .reduce(renderTextBalloon({frameWidth, frameHeight}), [])

  const images = objects
    .reduce(renderImage({frameWidth, frameHeight, urlDir, balloons} ), [])

  return svg({width: frameWidth, height: frameHeight}, 
    [link({
      rel: 'stylesheet',
      href: urlDir + '/style.css',
      type: "text/css",
    })]
    .concat(images)
    .concat(balloons)
  )
}


