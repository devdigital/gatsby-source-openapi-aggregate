const { map, always } = require('ramda')
const { isString, isFunction, notEmpty } = require('./utils')
const { verify } = require('./validator')

const specRules = {
  name: [
    [isString, 'name must be a string'],
    [notEmpty, 'name must not be empty'],
  ],
  resolve: [[isFunction, 'resolve must be a function']],
}

const optionRules = {
  specs: map(always(specRules)),
}

const optionsValidator = verify(optionRules, true)

module.exports = optionsValidator
