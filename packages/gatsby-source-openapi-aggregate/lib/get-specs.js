const { loggerValidator } = require('./validators/logger-validator')
const { optionsValidator } = require('./validators/options-validator')
const { processor } = require('./processor')
const errorPerProperty = require('inspected/formatters/error-per-property')
  .default

const displayErrors = (errors, logger) => {
  logger.error(
    `The provided gatsby-source-openapi-aggregate options are invalid:`
  )

  errors.property.forEach(error => {
    logger.error(`option: '${error.name}', error: ${error.messages.join(',')}`)
  })
}

const validateLogger = logger => {
  const validation = loggerValidator(logger)
  if (!validation.isValid) {
    throw new Error('The logger is invalid.')
  }
}

const validateOptions = logger => options => {
  const validation = optionsValidator(options)
  if (!validation.isValid) {
    displayErrors(errorPerProperty(validation.errors), logger)
    throw new Error('The provided options are invalid.')
  }
}

const getSpecs = async (options, logger) => {
  validateLogger(logger)
  validateOptions(logger)(options)

  const process = processor(logger)

  // TODO: options for resolving specs, e.g. batches
  const specs = await Promise.all(
    options.specs.map(async spec => {
      try {
        return await process(spec)
      } catch (exception) {
        // TODO: option for stop on spec fail
        logger.warning(
          `There was an error processing spec '${spec.name}', ${
            exception.name
          } ${exception.message} ${exception.stack}`
        )
      }
    })
  )

  return specs.filter(s => s)
}

exports.getSpecs = getSpecs
