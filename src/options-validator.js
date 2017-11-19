import spected from 'spected'
import deepmerge from 'deepmerge'
import { map, always, filter, is } from 'ramda'
import { isNonEmptyString, isFunction } from './utils'

export const isValid = value => {
  const a = filter(i => (i && isObject(i) ? !isValid(i) : i !== true), value)

  return isEmpty(a)
}

const defaultOptions = {
  specs: [{ name: null, resolve: null }]
}

const specRules = {
  name: [[isNonEmptyString, 'name must be a non empty string']],
  resolve: [[isFunction, 'resolve must be a function']]
}

const optionRules = {
  specs: map(always(specRules)) // [[notEmptyArray, 'specs must be a non empty array']],
}

const optionsValidator = options => {
  if (!options) {
    throw new Error('No options specified.')
  }

  const optionsToValidate = deepmerge(defaultOptions, options)

  console.log(optionsToValidate)
  const validation = spected(optionRules, optionsToValidate)
  console.log(validation)
  console.log('validation', isValid(validation))
}

module.exports = optionsValidator
