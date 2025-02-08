import {render} from './render.js'
import {parse} from './parse.js'
import {pipe} from './helpers.js'

export const renderComic = pipe(parse, render)

