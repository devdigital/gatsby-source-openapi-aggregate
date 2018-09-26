const map = require('ramda/src/map')
const always = require('ramda/src/always')

const isRequired = require('inspected/schema/is-required').default
const isFunction = require('inspected/schema/is-function').default
const isString = require('inspected/schema/is-string').default
const validate = require('inspected/validate').default

const specSchema = {
  name: [[isRequired(isString), 'name is a required string']],
  resolve: [[isRequired(isFunction), 'resolve is a required function']],
}

const optionsSchema = {
  specs: map(always(specSchema)),
}

module.exports.optionsValidator = validate(optionsSchema)
