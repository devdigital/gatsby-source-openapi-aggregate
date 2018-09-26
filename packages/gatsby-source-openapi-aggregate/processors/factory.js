const { swaggerParserProcessor } = require('./swagger-parser/index')
const { oaiTsCoreProcessor } = require('./oai-ts-core/index')

const specProcessorFactory = (content, context) => {
  if (!content) {
    throw new Error(`No content provided.`)
  }

  if (!context) {
    throw new Error(`No context provided`)
  }

  return swaggerParserProcessor
}

exports.specProcessorFactory = specProcessorFactory
