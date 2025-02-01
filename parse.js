const debug = true

export const isVoiceOver = (object) => 
  (object.name === 'NARRATOR' || object.mood === 'voiceover') 

const isCapitalized = (string) => {
  const stringBeforeBracket = string.split('(')[0]
  return stringBeforeBracket === stringBeforeBracket.toUpperCase()
}

const normalizeString = (string) => string && string.trim().toLowerCase().replace(' ', '-')

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
        currentObject = {
          name: normalizeString(name), 
          mood: normalizeString(mood),
        }
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
    let type
    const index = characters.indexOf(object)
    if (index === -1) {
      if (isVoiceOver) {
        displayText = i === objects.length -1 ? 'bottom' : 'top';
        type = 'voicever'
      } else {
        type = 'image'
      }
    } else if (index === 0) {
      displayText = 'start'
      type = 'character'
    } else if (index === characters.length - 1) {
      displayText = 'end'
      type = 'character'
    } else {
      displayText = 'middle'
      type = 'character'
    }
    return {type, displayText, ...object}
  })
} 

export const parse = (text) => addInfo(parseMarkup(text))
