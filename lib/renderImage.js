import {createElement} from './helpers.js'
const image = createElement('image') 
const svg = createElement('svg') 
const g = createElement('g') 

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

  // We assume the image has the same width than the frame
  const imageWidth = frameWidth
  const x = computeXLocation(frameWidth, width, object.displayText)
  return ({
    y,
    x ,
    height,
  })
}

const computeImageCoordinates = (imageObject, balloons, frameHeight, frameWidth) => {
  //Characters are rendered relative to speech balloons, other characters etc.
  if (imageObject.type === 'character') {
    return renderCharacter(imageObject, balloons, frameHeight, frameWidth)
  } else {
    //Other images just occupy the whole screen
    return ({
      width: frameWidth, 
      height: frameHeight, 
    })
  }
}





export const renderImageReference = ({frameWidth, frameHeight, urlDir, balloons}) => (images, imageObject) => {
  if (imageObject.type !== 'narrator' && imageObject.mood[0] !== 'off-screen') {
    let index = imageObject.mood.length
    const computeHref = (index) => [
      urlDir, 
      imageObject.name, 
      ...imageObject.mood.slice(0, index)
    ].filter(Boolean).join('/') + '.svg'

    const coordinates = computeImageCoordinates(imageObject, balloons, frameHeight, frameWidth)
    const theImage = svg({...coordinates, href: computeHref(index)})
    theImage.addEventListener('error', (e) => {
      if (index-- > 0) {
        theImage.setAttribute('href', computeHref(index))
      }
    })

    theImage.addEventListener('load', (e) => {
    })
    return images.concat(theImage)
  } else {
    return images
  } 
}


async function fetchSVG(url) {
    try {
        // Fetch the SVG file
        const response = await fetch(url);
        
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the SVG content as text
        const svgText = await response.text();
        
        // Create a new DOMParser instance
        const parser = new DOMParser();
        
        // Parse the SVG text into an XML document
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        
        // Get the SVG element from the parsed document
        const svgElement = svgDoc.documentElement;
        
        // Return the SVG element
        return svgElement;
    } catch (error) {
        console.error('Error fetching or parsing SVG:', error);
        return null;
    }
}


// An alternative implementation of renderImage, which embeds the image in the file. Can be used if you want to later serialize the file
export const renderImage = ({frameWidth, frameHeight, urlDir, balloons}) => (images, imageObject) => {
  if (imageObject.type !== 'narrator' && imageObject.mood[0] !== 'off-screen') {
    let index = imageObject.mood.length
    const computeHref = (index) => [
      urlDir, 
      imageObject.name, 
      ...imageObject.mood.slice(0, index)
    ].filter(Boolean).join('/') + '.svg'

    const coordinates = computeImageCoordinates(imageObject, balloons, frameHeight, frameWidth)

    const theImage = g({})

    fetchSVG(computeHref(index))
        .then((svgElement) => {
          svgElement.setAttribute('width', coordinates.width)
          svgElement.setAttribute('height', coordinates.height)
          svgElement.setAttribute('x', coordinates.x)
          svgElement.setAttribute('y', coordinates.y)
          theImage.appendChild(svgElement)
        })

    return images.concat(theImage)
  } else {
    return images
  } 
}


