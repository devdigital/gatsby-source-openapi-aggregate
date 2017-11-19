import { pipe, both, isEmpty, not } from 'ramda'

export const notEmpty = pipe(isEmpty, not)

export const notEmptyArray = both(notEmpty, Array.isArray)

export const isString = v =>
  v && Object.prototype.toString.call(v) === '[object String]'

export const isNonEmptyString = both(notEmpty, isString)

export const isFunction = v =>
  v && Object.prototype.toString.call(v) === '[object Function]'

export const isObject = v =>
  v && Object.prototype.toString.call(v) === '[object Object]'
