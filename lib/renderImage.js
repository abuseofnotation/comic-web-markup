import {createElement} from './helpers.js'
const image = createElement('image') 

const computeXLocation = (frameWidth, width, displayText) => {
  const xs = {
    start: frameWidth* 1/4 - width/2,
    middle: frameWidth* 2/4 - width/2,
    end: frameWidth* 3/4 - width/2,
  }
  return xs[displayText] || margin
}



const renderCharacter = (object, balloons, frameHeight, frameWidth) => {
  console.log('Rendering character ', object)

  const balloonFrames = balloons
    .map((balloon) => balloon.firstChild)
  
  // determine how much space is occupied by the frames
  const y = balloonFrames.reduce((y, frame) => {
    const frameEndY = parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
    if (frameEndY < frameHeight && frameEndY > y) {
      return frameEndY
    } else {
      return y
    }
  }, 0)

  const height = frameHeight - y

  // We assume images are squares
  const width = height

  // We assume the image has the same width than the frame
  const imageWidth = frameWidth
  const x = computeXLocation(frameWidth, width, object.displayText)
  return image({
    y,
    x ,
    height,
  })
}

const computeImage = (imageObject, balloons, frameHeight, frameWidth) => {
  if (imageObject.type === 'character') {
    return renderCharacter(imageObject, balloons, frameHeight, frameWidth)
  } else {
    return image({
      width: frameWidth, 
      height: frameHeight, 
    })
  }
}

export const renderImage = ({frameWidth, frameHeight, urlDir, balloons}) => (images, imageObject) => {
  if (imageObject.type !== 'voiceover') {
    let index = imageObject.mood.length
    const computeHref = (index) => [
      urlDir, 
      imageObject.name.trim().toLowerCase(), 
      ...imageObject.mood.slice(0, index)
    ].filter(Boolean).join('/') + '.svg'

    const theImage = computeImage(imageObject, balloons, frameHeight, frameWidth)
    theImage.setAttribute('href', computeHref(index))
    theImage.addEventListener('error', (e) => {
      if (index-- > 0) {
        theImage.setAttribute('href', computeHref(index))
      }
    })
    //theImage.onError = (e) => console.log('error')
    return images.concat(theImage)
  } else {
    return images
  } 
}
