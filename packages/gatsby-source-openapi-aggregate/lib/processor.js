const parse = require('openapi-parse').default
const { contentResolve } = require('./content-resolve')

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
  // TODO: convert to { ... } structure
  return {
    info: spec,
    schema,
  }
}

module.exports.processor = processor
