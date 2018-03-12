const { pipe, both, isEmpty, not, isNil } = require('ramda')

const notEmpty = pipe(isEmpty, not)

const notEmptyArray = both(notEmpty, Array.isArray)

const isString = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object String]'

const isNonEmptyString = both(notEmpty, isString)

const isFunction = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object Function]'

const isObject = v =>
  !isNil(v) && Object.prototype.toString.call(v) === '[object Object]'

module.exports = {
  notEmpty,
  notEmptyArray,
  isString,
  isNonEmptyString,
  isFunction,
  isObject,
}
