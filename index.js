import {render} from './render.js'
import {parse} from './parse.js'

const pipe = (...f) => (arg, config)=> f.reduce((res, f) => f(res, config), arg)

export const renderComic = pipe(parse, render)

