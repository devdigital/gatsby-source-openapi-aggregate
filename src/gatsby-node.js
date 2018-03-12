const crypto = require(`crypto`)
const specProcessorFactory = require('./processors/factory')
const loggerFactory = require('./logger-factory')

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

const getSpecs = options => {
  // TODO: validate options [{ name, resolve }]
  // each name should be unique, only name and resolve properties should be present
  // also, resolve should be a function which returns a promise
  options.specs.forEach(async spec => {
    let content = null
    try {
      content = await spec.resolve()
    } catch (exception) {
      console.warn(
        `There was an error resolving spec '${spec.name}', ${exception.name} ${
          exception.message
        } ${exception.stack}`
      )
    }

    if (jsonText === null) {
      return
    }

    try {
      const specObj = JSON.parse(jsonText)
      const processor = specProcessorFactory(logger)(specObj)
      const result = await processor(spec.name, specObj)
    } catch (exception) {
      console.warn(
        `There was an error processing spec '${spec.name}', ${exception.name} ${
          exception.message
        } ${exception.stack}`
      )
    }
  })
}

const createNodes = (specs, createNode) => {
  // { information, paths, responses, definitions }
  const nodes = []
  nodes.push(toNode(result.information, 'OpenApiSpec'))
  result.paths.forEach(p => {
    nodes.push(toNode(p, 'OpenApiSpecPath'))
  })
  result.responses.forEach(r => {
    nodes.push(toNode(r, 'OpenApiSpecResponse'))
  })
  result.definitions.forEach(d => {
    nodes.push(toNode(d, 'OpenApiSpecDefinition'))
  })

  nodes.forEach(n => {
    createNode(n)
  })
}

exports.sourceNodes = async ({ boundActionCreators }, options) => {
  const { createNode } = boundActionCreators

  const specs = getSpecs(options)
  createNodes(specs, createNode)
}
