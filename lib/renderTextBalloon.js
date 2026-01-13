import {createElement, max} from './helpers.js'

const debug = true

const circle = createElement('circle')
const text = createElement('text')
const tspan = createElement('tspan')
const rect = createElement('rect')
const g = createElement('g')
const svg = createElement('svg')

const startingLocation = 5

const margin = 20
const padding = 15
const horizontalPadding = 20


const textPanel = (object, x, y) => {

  const textSize = object.textSize
  // The height of the balloon is the number of lines, multiplied by the size
  const height = (textSize * object.text.length) + padding * 2
  const width = object.width
  const newTextFrame = rect({ 
    x,
    y,
    height,
    width,
    class: 'frame',
  })

  const lines = object.text.map((line, i) => text({
    text: line, 
    x: x + width/2,
    //style: 'dominant-baseline:middle',
    style: 'text-anchor:middle',
    y:  y + ((i + 1) * textSize) + padding
  }))
  return g({
    class: `balloon balloon-${object.name}`,
    style:`font-size : ${textSize}px`,
  },  [newTextFrame].concat(lines))
}

const computeYLocation = (texts, xLocation) => {
  // The distance between individual balloons
  const balloonMargin = 10
  // The distance between the end of the panel and the first balloon
  const frames = texts
    .map((text) => text.firstChild)
    // Get all the elements that do not overlap with our element on the x axis.
    .filter((frame) => parseInt(frame.getAttribute('x')) + parseInt(frame.getAttribute('width')) > xLocation) 

  // Get the location of the last element
  const frame = frames[frames.length - 1]

  // Compute the location of its bottom and start from there
  if (frame !== undefined) {
    return balloonMargin + parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
  } else { 
    // Or start from the first location if ther isn't a prev balloon
    return startingLocation
  }
}

const computeXLocation = (object, spaceLeft) => {
  const xs = {
    start: margin,
    middle: spaceLeft/2 - margin,
    end: spaceLeft - margin
  }
  return xs[object.displayText] || margin
}



export const renderTextBalloon = ({frameWidth, frameHeight}) => (texts, object) =>  {
  debug && console.log('Adding text panel', object)
  // balloons with displayText bottom are outside of the normal flow

  const textSize = object.textSize
  if (object.type === 'narrator') {
    const width = frameWidth
    const x = 0
    const y = object.displayText !== 'bottom' 
      ? 0
      : frameHeight - (object.text.length * textSize) - (padding * 2)
    return texts.concat([textPanel( object, x, y, object.width)])
  } else {
    const x = computeXLocation(object, frameWidth - object.width)
    const y = parseInt(computeYLocation(texts, x))
    return texts.concat([textPanel( object, x, y)])
  }
}
