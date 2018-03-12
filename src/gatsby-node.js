const crypto = require(`crypto`)
const specProcessorFactory = require('./processors/factory')
const loggerFactory = require('./logger-factory')
const getSpecs = require('./get-specs')

const toHash = value => {
  return crypto
    .createHash(`md5`)
    .update(value)
    .digest(`hex`)
}

const toNode = (data, type) => {
  const openApiPrefix = 'openapi.'

  if (!data) {
    throw new Error('No data object specified')
  }

  if (!type) {
    throw new Error('No type specified')
  }

  if (!data.hasOwnProperty('id')) {
    throw new Error('Data object has no id property')
  }

  if (!data.hasOwnProperty('parent')) {
    throw new Error('Data object has no parent property')
  }

  if (!data.hasOwnProperty('children') || !Array.isArray(data.children)) {
    throw new Error('Data object has no children array property')
  }

  if (data.hasOwnProperty('fields') && data.hasOwnProperty('meta')) {
    throw new Error('Data object defines both a fields and a meta property')
  }

  if (!data.hasOwnProperty('fields') && !data.hasOwnProperty('meta')) {
    throw new Error('Data object does not define a fields or meta property')
  }

  const node = Object.assign(
    {
      id: `${openApiPrefix}${data.id}`,
      parent: data.parent ? `${openApiPrefix}${data.parent}` : null,
      children: data.children.map(c => `${openApiPrefix}${c}`),
      internal: {
        type,
      },
    },
    data.fields
  )

  if (data.meta) {
    node.internal.contentDigest = toHash(data.meta.content)
    node.internal.mediaType = data.meta.mediaType
    node.internal.content = data.meta.content
    return node
  }

  node.internal.contentDigest = toHash(JSON.stringify(data.fields))
  return node
}

const createNodes = (specs, createNode) => {
  // { information, paths, responses, definitions }
  specs.forEach(spec => {
    const nodes = []
    nodes.push(toNode(spec.information, 'OpenApiSpec'))
    spec.paths.forEach(p => {
      nodes.push(toNode(p, 'OpenApiSpecPath'))
    })
    spec.responses.forEach(r => {
      nodes.push(toNode(r, 'OpenApiSpecResponse'))
    })
    spec.definitions.forEach(d => {
      nodes.push(toNode(d, 'OpenApiSpecDefinition'))
    })

    nodes.forEach(n => {
      createNode(n)
    })
  })
}

exports.sourceNodes = async (foo, options) => {
  console.log('foo', foo)
  const { createNode } = foo.boundActionCreators

  const specs = await getSpecs(options)
  createNodes(specs, createNode)
}
