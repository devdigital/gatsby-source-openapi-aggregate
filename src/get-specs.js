const optionsValidator = require('./options-validator')

const getSpecs = async options => {
  const valid = optionsValidator(options)
  console.log(valid)

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
