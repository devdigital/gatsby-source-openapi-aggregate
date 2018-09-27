const crypto = require(`crypto`)

const toHash = value => {
  return crypto
    .createHash(`md5`)
    .update(value)
    .digest(`hex`)
}

const toNode = prefix => (data, type) => {
  const openApiPrefix = prefix

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

const convertSpecToNodes = spec => {
  const nodes = []
  const node = toNode('openapi.') // TODO: make configurable

  if (spec.information) {
    nodes.push(node(spec.information, 'OpenApiSpec'))
  }

  if (spec.paths) {
    spec.paths.forEach(p => {
      nodes.push(node(p, 'OpenApiSpecPath'))
    })
  }

  if (spec.responses) {
    spec.responses.forEach(r => {
      nodes.push(node(r, 'OpenApiSpecResponse'))
    })
  }

  if (spec.definitions) {
    spec.definitions.forEach(d => {
      nodes.push(node(d, 'OpenApiSpecDefinition'))
    })
  }

  return nodes
}

const convertSpecsToNodes = specs => {
  return specs.flatMap(spec => convertSpecToNodes(spec))
}

module.exports.convertSpecsToNodes = convertSpecsToNodes
