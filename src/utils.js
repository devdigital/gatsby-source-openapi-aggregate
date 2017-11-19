import { pipe, both, isEmpty, not, isNil } from 'ramda'

export const notEmpty = pipe(isEmpty, not)

export const notEmptyArray = both(notEmpty, Array.isArray)

export const isString = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object String]'

export const isNonEmptyString = both(notEmpty, isString)

export const isFunction = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object Function]'

export const isObject = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object Object]'
