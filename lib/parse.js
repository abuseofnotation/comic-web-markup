const debug = true
import {pipe, max} from './helpers.js'

export const isVoiceOver = (object) => 
  (object.name === 'narrator') 

const isCapitalized = (string) => {
  const stringBeforeBracket = string.split('(')[0]
  return stringBeforeBracket === stringBeforeBracket.toUpperCase()
}

const normalizeString = (string) => 
  string.trim().toLowerCase().replaceAll(' ', '-')

const normalizeMood = (string) => 
  string.split(',').map(normalizeString)

const parseCharacterSetting = (line) => {
  let [name, mood] = line.split(/\(|\)/)
  return {
    name: normalizeString(name), 
    mood: mood ? normalizeMood(mood) : [],
  }
}
const parseMarkup = (markup, url) => {
  debug && console.log("Parsing Markup", markup)
  const objects = []
  let currentObject
  for (let line of markup.split('\n')) {
    if (line.trim() !== '') {
      if (currentObject === undefined ) {
        currentObject = parseCharacterSetting(line)
      } else {
        if (isCapitalized(line)) {
          objects.push(currentObject)
          currentObject = parseCharacterSetting(line)
        } else {
          currentObject.text = (currentObject.text || []).concat(line)
        }
      }
    } else if (currentObject !== undefined) {
      objects.push(currentObject)
      currentObject = undefined
    }
  }

  if (currentObject !== undefined) {
    objects.push(currentObject)
  }
  return objects
}

const addInfo = (objects, config = {}) => {
  const characterLines = objects
    .filter((object) => 
      object.text !== undefined && !isVoiceOver(object))

  const characters = characterLines
    .filter((line, i) => 
      characterLines.findIndex((theLine) => line.name === theLine.name) === i)

  const textSize = config.textSize ? parseInt(config.textSize) : 16
      

  const computeTextSize = (object, chars) => {
    return chars > 20 ? textSize : textSize * 1.2
  }
  const computeWidth = (chars, textSize) => {
      return (chars + 4 ) * textSize/2
  }

  return objects.map((object, i) => {
    let displayText
    let type
    let characterIndex
    let textSize
    let width

    const index = characters.findIndex((theObject) => theObject.name === object.name)

    if (object.text !== undefined) {
      if (index === -1) {
        if (isVoiceOver(object)) {
          displayText = i === objects.length -1 ? 'bottom' : 'top';
          type = 'narrator'
        } else {
          throw "WHaaat?"
        }
      } else {
        characterIndex = index
        if (index === 0) {
          displayText = 'start'
          type = 'character'
        } else if (index === characters.length - 1) {
          displayText = 'end'
          type = 'character'
        } else {
          displayText = 'middle'
          type = 'character'
        }
      }
      const chars = max(object.text.map((line) => line.length))
      textSize = computeTextSize(object, chars)
      width = computeWidth(chars, textSize)
    }
    return {
      type, 
      displayText, 
      characterCount: characters.length,
      characterIndex, 
      textSize, 
      width,
      ...object
    }
  })
} 

export const parse = pipe(parseMarkup, addInfo)
