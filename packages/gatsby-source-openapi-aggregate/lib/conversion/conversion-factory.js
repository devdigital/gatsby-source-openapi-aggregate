const { spec20Converter } = require('./spec20-converter')
const { spec30Converter } = require('./spec30-converter')

const convert = schema => {
  if (!schema) {
    throw new Error('Unexpected missing schema when converting.')
  }

  if (schema.swagger === '2.0') {
    return spec20Converter
  }

  if (schema.openapi === '3.0.0') {
    return spec30Converter
  }

  throw new Error('Unable to find converter for schema.')
}

module.exports.convert = convert
