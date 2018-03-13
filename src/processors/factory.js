const spec20Processor = require('./spec20Processor')

const specProcessorFactory = (content, logger) => {
  if (!content) {
    throw new Error(`No content provided.`)
  }

  if (!logger) {
    throw new Error(`No logger provided`)
  }

  try {
    const spec = JSON.parse(content)

    if (spec.swagger === '2.0') {
      return spec20Processor(logger)
    }

    throw new Error(`Unsupported JSON spec version ${spec.swagger}.`)
  } catch (exception) {
    throw new Error(`Expected content to be JSON.`)
  }
}

module.exports = specProcessorFactory
