const spec20Processor = require('./spec20Processor')

const specProcessorFactory = (content, context) => {
  if (!content) {
    throw new Error(`No content provided.`)
  }

  if (!context) {
    throw new Error(`No context provided`)
  }

  try {
    const spec = JSON.parse(content)

    if (spec.swagger === '2.0') {
      return spec20Processor(content, context)
    }

    throw new Error(`Unsupported JSON spec version ${spec.swagger}.`)
  } catch (exception) {
    throw new Error(`Expected content to be JSON.`)
  }
}

module.exports = specProcessorFactory
