const isArray = require('inspected/schema/is-array').default

const toServers = (host, basePath, schemes) => {
  const defaultValue = [{ url: '/' }]

  if (!schemes) {
    if (!host && !basePath) {
      return defaultValue
    }

    return [{ url: `//${host || ''}${basePath || ''}` }]
  }

  if (!isArray(schemes)) {
    throw new Error('Unexpected schemes value, must be an array.')
  }

  if (!host && !basePath && schemes.length === 0) {
    return defaultValue
  }

  if (schemes.length === 0) {
    return [{ url: `//${host || ''}${basePath || ''}` }]
  }

  return schemes.map(s => ({
    url: `${s}://${host || ''}${basePath || ''}`,
  }))
}

const spec20Converter = async (spec, schema) => {
  const rootId = `spec.${spec.name}`

  const information = {
    id: rootId,
    parent: null,
    children: [], // TODO: [...paths.map(p => p.id), ...definitions.map(d => d.id)]
    fields: {
      specVersion: schema.swagger,
      name: spec.name,
      ...schema.info,
      servers: toServers(schema.host, schema.basePath, schema.schemes),
    },
  }

  return {
    information,
  }
}

module.exports = {
  toServers,
  spec20Converter,
}
