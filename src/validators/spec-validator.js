import map from 'ramda/src/map'
import always from 'ramda/src/always'

import isOptional from 'inspected/schema/is-optional'
import isRequired from 'inspected/schema/is-required'
import isFunction from 'inspected/schema/is-function'
import isString from 'inspected/schema/is-string'
import isArray from 'inspected/schema/is-array'

import validate from 'inspected/validate'
import errorPerProperty from 'inspected/formatters/error-per-property'

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

module.exports = specValidator
