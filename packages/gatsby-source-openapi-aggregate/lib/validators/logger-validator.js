const isRequired = require('inspected/schema/is-required').default
const isFunction = require('inspected/schema/is-function').default
const validate = require('inspected/validate').default

const loggerSchema = {
  trace: [[isRequired(isFunction), 'trace is a required function']],
  info: [[isRequired(isFunction), 'info is a required function']],
  warning: [[isRequired(isFunction), 'warning is a required function']],
  error: [[isRequired(isFunction), 'error is a required function']],
  success: [[isRequired(isFunction), 'success is a required function']],
}

module.exports.loggerValidator = validate(loggerSchema)
