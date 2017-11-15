import spected from 'spected'
import deepmerge from 'deepmerge'
import { pipe, both, isEmpty, not, mergeDeepRight, map, always } from 'ramda'

const notEmpty = pipe(isEmpty, not)
const notEmptyArray = both(notEmpty, Array.isArray)
const isString = v =>
  v && Object.prototype.toString.call(v) === '[object String]'
const isNonEmptyString = both(notEmpty, isString)
const isFunction = v =>
  v && Object.prototype.toString.call(v) === '[object Function]'

const defaultOptions = {
  specs: [{ name: null, resolve: null }],
}

const specRules = {
  name: [[isNonEmptyString, 'name must be a non empty string']],
  resolve: [[isFunction, 'resolve must be a function']],
}

const optionRules = {
  specs: map(always(specRules)), // [[notEmptyArray, 'specs must be a non empty array']],
}

const optionsValidator = options => {
  if (!options) {
    throw new Error('No options specified.')
  }

  const optionsToValidate = deepmerge(defaultOptions, options)

  console.log('options', optionsToValidate)
  const validation = spected(optionRules, optionsToValidate)
  console.log('validation', validation.specs[0])
}

module.exports = optionsValidator
