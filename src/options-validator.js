import map from 'ramda/src/map'
import always from 'ramda/src/always'
import isRequired from 'inspected/validation/is-required'
import isString from 'inspected/validation/is-string'
import isFunction from 'inspected/validation/is-function'
import validate from 'inspected/validate'
import errorPerProperty from 'inspected/formatters/error-per-property'

const specSchema = {
  name: [[isRequired(isString), 'name is a required string']],
  resolve: [[isRequired(isFunction), 'resolve is a required function']],
}

const optionsSchema = {
  specs: map(always(specSchema)),
}

const optionsValidator = validate(optionsSchema, {
  errorFormatter: errorPerProperty,
})

module.exports = optionsValidator
