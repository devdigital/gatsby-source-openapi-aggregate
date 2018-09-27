const parse = require('openapi-parse').default
const { contentResolve } = require('./content-resolve')
const { convert } = require('./conversion/conversion-factory')

const processor = logger => async spec => {
  const content = await contentResolve(logger)(spec)

  const specOptions = spec.options || {}

  const parseOptions = {
    basePath: specOptions.basePath || null,
    dereference: specOptions.dereference || false,
    parser: specOptions.parser,
    resolver: specOptions.resolver,
  }

  const schema = await parse(parseOptions)(content)
  const domainSchema = await convert(schema)(spec, schema)
  // TODO: validate domain schema
  return {
    info: spec,
    schema: domainSchema,
  }
}

module.exports.processor = processor
