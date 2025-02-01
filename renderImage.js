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



const renderCharacter = (object, href, balloons, frameHeight, frameWidth) => {
  console.log('Rendering character ', object)

  const balloonFrames = balloons
    .map((balloon) => balloon.firstChild)
   
  /*
  let height = 0
  let y
  balloonFrames
    .forEach((frame, i) => {
      const nextFrame = balloonFrames[i + 1]
      const nextFrameY = nextFrame ? parseInt(nextFrame.getAttribute('y')) : frameHeight
      const frameEndY = parseInt(frame.getAttribute('height')) + parseInt(frame.getAttribute('y'))
      const imageHeight = nextFrameY - frameEndY 
      if (imageHeight > height) {
        height = imageHeight
        y = frameEndY 
      }
    })
  */

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
  console.log(x)


  return image({
    href,
    y,
    x ,
    height,
  })
}

export const renderImage = ({frameWidth, frameHeight, urlDir, balloons}) => (images, imageObject) => {
  const href = [urlDir, 'images', imageObject.name.trim().toLowerCase(), imageObject.mood].filter(Boolean).join('/') + '.svg'

  if (imageObject.type === 'character') {
    return images.concat([renderCharacter(imageObject, href, balloons, frameHeight, frameWidth)])
  } else if (imageObject.type === 'voiceover') {
    return images
  } else {
    return images.concat([image({
      width: frameWidth, 
      height: frameHeight, 
      href,
    })])
  }
}
