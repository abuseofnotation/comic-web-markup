import {createElement, max} from './helpers.js'

const debug = true

const circle = createElement('circle')
const text = createElement('text')
const tspan = createElement('tspan')
const rect = createElement('rect')
const g = createElement('g')
const svg = createElement('svg')

const margin = 5

const padding = 15

const textSize = 20

const textPanel = (object, x, y, width) => {

  // The height of the baloon is the number of lines, multiplied by the size
  const height = textSize * object.text.length + padding * 2
  const newTextFrame = rect({ 
    x,
    y,
    height,
    width,
    class: 'frame',
  })

  const lines = object.text.map((line, i) => text({
    text: line, 
    x: x + padding, 
    // style: 'dominant-baseline:middle'.
    y:  y + ((i + 1) * textSize) + padding
  }))
  return g({
    class: `balloon balloon-${object.name}`,
    style:`font-size : ${textSize}px`,
  },  [newTextFrame].concat(lines))
}

const computeYLocation = (texts) => {
  // The distance between individual baloons
  const baloonMargin = 3
  // The distance between the end of the panel and the first baloon
  const startingLocation = 20

  // Get the location of the previous element
  const lastElement = texts[texts.length - 1]

  // Compute the location of its bottom and start from there
  if (lastElement !== undefined) {
    const frame = lastElement.firstChild
    return baloonMargin + parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
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


const computeWidth = (object) => {
  const tempPanel = textPanel(object, 0, 0, 0)
  const tempElement = svg({}, [tempPanel])
  document.body.appendChild(tempElement)
  const width = max([...tempPanel.children].map((line) => line.getBBox().width)) + 2* padding
  document.body.removeChild(tempElement)
  return width
}


export const renderTextBalloon = ({frameWidth, frameHeight}) => (texts, object) =>  {
  debug && console.log('Adding text panel', object)
  //Determine if the baloon contains lines by the narrator
  const narrator = object.displayText === 'top' || object.displayText === 'bottom'
  // baloons with displayText bottom are outside of the normal flow
  const y = object.displayText !== 'bottom' 
    ? parseInt(computeYLocation(texts))
    : frameHeight - (object.text.length * textSize) - (padding * 2)

  if (narrator) {
    const width = frameWidth
    const x = 0
    return texts.concat([textPanel( object, x, y, width)])
  } else {
    const width = computeWidth(object)
    const x = computeXLocation(object, frameWidth - width)
    return texts.concat([textPanel( object, x, y, width)])
  }
}
