const crypto = require(`crypto`)
const specProcessorFactory = require('./processors/factory')
const loggerFactory = require('./logger-factory')
const getSpecs = require('./get-specs')
const omit = require('lodash.omit')

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

// Mirrors the functionality of yurnalist
const defaultReporter = {
  log: message => console.log(message),
  info: message => console.log(message),
  warn: message => console.warn(message),
  error: message => console.error(message),
  success: message => console.log(message),
}

// Gatsby uses yurnalist (https://github.com/0x80/yurnalist) for reporting
const reporterLogger = reporter => {
  const logger = reporter || defaultReporter
  return {
    trace: message => logger.log(message),
    info: message => logger.info(message),
    warning: message => logger.warn(message),
    error: message => logger.error(message),
    success: message => logger.success(message),
  }
}

exports.sourceNodes = async ({ boundActionCreators, reporter }, options) => {
  const { createNode } = boundActionCreators

  const cleanedOptions = omit(options, 'plugins')
  const specs = await getSpecs(cleanedOptions, reporterLogger(reporter))
  createNodes(specs, createNode)
}
