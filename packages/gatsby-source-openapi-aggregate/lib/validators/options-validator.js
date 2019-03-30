const map = require('ramda/src/map')
const always = require('ramda/src/always')

const isRequired = require('inspected/schema/is-required').default
const isFunction = require('inspected/schema/is-function').default
const isString = require('inspected/schema/is-string').default
const isArray = require('inspected/schema/is-array').default
const validate = require('inspected/validate').default

const specSchema = {
  name: [[isRequired(isString), 'name is a required string']],
  resolve: [[isRequired(isFunction), 'resolve is a required function']],
}

const optionsSchema = {
  specs: [[isRequired(isArray), 'specs is a required array']],
  //TODO: each element in specs should match specSchema
}

module.exports.optionsValidator = validate(optionsSchema)
