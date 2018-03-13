const optionsValidator = require('./options-validator')

const displayErrors = (errors, logger) => {
  logger.error(
    `The provided gatsby-source-openapi-aggregate options are invalid:`
  )
  errors.forEach(error => {
    logger.error(`option: '${error.name}', error: ${error.messages.join(',')}`)
  })
}

const getSpecs = async (options, logger) => {
  console.log(options)
  const validation = optionsValidator(options)
  if (!validation.isValid) {
    displayErrors(validation.errors, logger)
    throw new Error('The provided options are invalid.')
  }

  return []
  // TODO: validate options [{ name, resolve }]
  // each name should be unique, only name and resolve properties should be present
  // also, resolve should be a function which returns a promise
  // options.specs.forEach(async spec => {
  //   let content = null
  //   try {
  //     content = await spec.resolve()
  //   } catch (exception) {
  //     console.warn(
  //       `There was an error resolving spec '${spec.name}', ${exception.name} ${
  //         exception.message
  //       } ${exception.stack}`
  //     )
  //   }

  //   if (jsonText === null) {
  //     return
  //   }

  //   try {
  //     const specObj = JSON.parse(jsonText)
  //     const processor = specProcessorFactory(logger)(specObj)
  //     const result = await processor(spec.name, specObj)
  //   } catch (exception) {
  //     console.warn(
  //       `There was an error processing spec '${spec.name}', ${exception.name} ${
  //         exception.message
  //       } ${exception.stack}`
  //     )
  //   }
  // })
}

module.exports = getSpecs
