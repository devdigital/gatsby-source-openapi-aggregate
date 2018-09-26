const swaggerParser = require('swagger-parser')
const isString = require('inspected/schema/is-string').default
const isRequired = require('inspected/schema/is-required').default

const swaggerParserProcessor = async (content, context) => {
  if (!isRequired(isString)(content)) {
    throw new Error(`No content to process.`)
  }

  if (!context) {
    throw new Error(`No context provided.`)
  }

  const result = await swaggerParser.bundle(content)
  console.log(result)
}

exports.swaggerParserProcessor = swaggerParserProcessor
