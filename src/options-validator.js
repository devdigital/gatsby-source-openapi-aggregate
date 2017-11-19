import { map, always } from 'ramda'
import { isString, isFunction, notEmpty } from './utils'
import { verify } from './validator'

export const specRules = {
  name: [
    [isString, 'name must be a string'],
    [notEmpty, 'name must not be empty']
  ],
  resolve: [[isFunction, 'resolve must be a function']]
}

export const optionRules = {
  specs: map(always(specRules))
}

const optionsValidator = verify(optionRules, true)

module.exports = optionsValidator
