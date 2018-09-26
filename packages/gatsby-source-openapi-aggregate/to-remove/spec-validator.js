const map = require('ramda/src/map')
const always = require('ramda/src/always')

const isOptional = require('inspected/schema/is-optional').default
const isRequired = require('inspected/schema/is-required').default
const isFunction = require('inspected/schema/is-function').default
const isString = require('inspected/schema/is-string').default
const isArray = require('inspected/schema/is-array').default

const validate = require('inspected/validate').default
const errorPerProperty = require('inspected/formatters/error-per-property')
  .default

const informationSchema = {
  name: [[isRequired(isString), 'name is a required string']],
  title: [[isRequired(isString), 'title is a required string']],
  description: [[isOptional(isString), 'description is an optional string']],
  version: [[isRequired(isString), 'version must be a string']],
  host: [[isOptional(isString), 'host must be a string']],
  schemes: [[isOptional(isArray), 'schemes must be an array']],
  basePath: [[isOptional(isString), 'basePath must be a string']],
  produces: [[isOptional(isArray), 'produces must be an array']],
  consumes: [[isOptional(isArray), 'consumes must be an array']],
}

const specSchema = {
  information: informationSchema,
}

const specValidator = validate(specSchema, {
  errorFormatter: errorPerProperty,
})

exports.specValidator = specValidator
