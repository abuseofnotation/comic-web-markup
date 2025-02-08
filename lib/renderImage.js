import {createElement} from './helpers.js'
const image = createElement('image') 

const computeXLocation = (frameWidth, width, object) => {
  return frameWidth * ((object.characterIndex + 1) / (object.characterCount + 1)) - width/2
  /*
  const xs = {
    start: frameWidth* 1/4 - width/2,
    middle: frameWidth* 2/4 - width/2,
    end: frameWidth* 3/4 - width/2,
  }
  return xs[displayText] || margin
  */
}

const renderCharacter = (object, balloons, frameHeight, frameWidth) => {
  console.log('Rendering character ', object)

  const balloonFrames = balloons
    .map((balloon) => balloon.firstChild)
  
  // determine how much space is occupied by the frames
  const y = balloonFrames.reduce((y, frame) => {
    const frameEndY = parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
    console.log({frameEndY, frameHeight})
    // checks if the frame isnt at the bottom of the screen
    if (frameEndY + 2 < frameHeight 
      //Check if the frame is higher than the current location
      && frameEndY > y) {
      return frameEndY
    } else {
      return y
    }
  }, 0)

  const height = frameHeight - y

  // We assume images are squares
  const width = height

  const x = computeXLocation(frameWidth, width, object)
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
      preserveAspectRatio: "xMidYMid slice"
    })
  }
}

export const renderImage = ({frameWidth, frameHeight, urlDir, balloons, fileType}) => (images, imageObject) => {
  if (imageObject.type !== 'narrator' && imageObject.mood[0] !== 'off-screen') {
    let index = imageObject.mood.length
    const computeHref = (index) => [
      urlDir, 
      imageObject.name, 
      ...imageObject.mood.slice(0, index)
    ].filter(Boolean).join('/') + '.' + fileType

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
