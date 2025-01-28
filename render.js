import {isVoiceOver, createElement, maxLength} from './helpers.js'

const debug = true

const frameWidth = 500
const frameHeight = 500

const textSize = 30

const svg = createElement('svg')
const image = createElement('image')
const circle = createElement('circle')
const text = createElement('text')
const tspan = createElement('tspan')
const rect = createElement('rect')
const g = createElement('g')

const addNewImage = (url, texts) => (images, object) => {
  const urlDir = url.split('/').slice(0, -1).join('/')
  const href = [urlDir, 'images', object.name.trim().toLowerCase(), object.mood].filter(Boolean).join('/') + '.svg'
  return images.concat([image({width: frameWidth, height: frameHeight, href})])
}

const getYLocation = (texts) => {
  const lastElement = texts[texts.length - 1]
  if (lastElement === undefined) {
    return 20
  } else { 
    const frame = lastElement.firstChild
    return 20 + parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
  }
}

const addNewText = (texts, object) =>  {
  debug && console.log('Adding text panel', object)
  const narrator = object.displayText === 'top' || object.displayText === 'bottom'
  const panelOffset = narrator ? 0 : 100 
  const padding = 5
  // The so called "narrator panes" occupy the whole screen
  const margin = narrator ? 0 : 5

  const width = frameWidth - margin * 2 - panelOffset
  // the text size is such that the longest Line fits screen width
  //const textSize = width / maxLength(object.text) + 10
  const textSize = 20
  
  const xs = {
    start: margin,
    middle: margin + panelOffset/2,
    end: margin + panelOffset,
    top: 0,
    bottom: 0,
  }
  const x = xs[object.displayText] || margin

  // The height of the textbox is the number of lines, multiplied by the size
  const height = textSize * object.text.length + padding * 2


  const y = object.displayText !== 'bottom' 
    ? parseInt(getYLocation(texts))
    : frameHeight - (object.text.length * textSize) - (padding * 2)
  const newTextFrame = rect({ 
    x,
    y: y,
    height,
    width,
    fill: 'white',
    stroke: 'black',
    style: `baloon, balloon-${object.displayText}`,
    rx: narrator ? 0 : 15,
    ry: narrator ? 0 : 15,
  })

  const lines = object.text.map((line, i) => text({
    text: line, 
    x: x + padding, 
    // style: 'dominant-baseline:middle'.
    y:  y + ((i + 1) * textSize) + padding
  }))

  const textPanel = g({
    style:`font-size : ${textSize}px`,
  }, [newTextFrame].concat(lines))
  return texts.concat([textPanel])
}


export const render = (objects, url) => {
  const texts = objects
    .filter((object) => object.text !== undefined)
    .reduce(addNewText, [])

  const images = objects
    .filter((object) => !isVoiceOver(object))
    .reduce(addNewImage(url, texts), [])

  return svg({width: frameWidth, height: frameHeight}, images.concat(texts))
}


