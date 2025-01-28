import {isVoiceOver} from './helpers.js'
const debug = true


const isCapitalized = (string) => {
  const stringBeforeBracket = string.split('(')[0]
  return stringBeforeBracket === stringBeforeBracket.toUpperCase()
}

const parseMarkup = (markup, url) => {
  debug && console.log("Parsing Markup", markup)
  const objects = []
  let currentObject
  for (let line of markup.split('\n').filter((line) => line)) {
    if (currentObject === undefined ) {
      currentObject = {name: line}
    } else {
      if (isCapitalized(line)) {
        objects.push(currentObject)
        let [name, mood] = line.split(/\(|\)/)
        currentObject = {name: name.trim(), mood: mood && mood.trim()}
      } else {
        currentObject.text = (currentObject.text || []).concat(line)
      }
    }
  }
  objects.push(currentObject)
  return objects
}

const addInfo = (objects) => {

  const characters = objects
    .filter((object) => 
      object.text !== undefined && !isVoiceOver(object))

  return objects.map((object, i) => {
    let displayText
    const index = characters.indexOf(object)
    if (index === -1) {
      displayText = i === objects.length -1 ? 'bottom' : 'top';
    } else if (index === 0) {
      displayText = 'start'
    } else if (index === characters.length - 1) {
      displayText = 'end'
    } else {
      displayText = 'middle'
    }
    return {displayText, ...object}
  })
} 

export const parse = (text) => addInfo(parseMarkup(text))
