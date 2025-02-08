const debug = true

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
    if (line) {
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

const addInfo = (objects) => {
  const characterLines = objects
    .filter((object) => 
      object.text !== undefined && !isVoiceOver(object))

  const characters = characterLines
    .filter((line, i) => 
      characterLines.findIndex((theLine) => line.name === theLine.name) === i)
      


  return objects.map((object, i) => {
    let displayText
    let type
    let characterIndex
    //const index = characters.indexOf(object)
    const index = characters.findIndex((theObject) => theObject.name === object.name)
    if (index === -1) {
      if (isVoiceOver(object)) {
        displayText = i === objects.length -1 ? 'bottom' : 'top';
        type = 'narrator'
      } else {
        type = 'image'
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
    return {
      type, 
      displayText, 
      characterCount: characters.length,
      characterIndex, 
      ...object
    }
  })
} 

export const parse = (text) => addInfo(parseMarkup(text))
