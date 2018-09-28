const spec30Converter = async (spec, schema) => {
  const rootId = `spec.${spec.name}`

  const information = {
    id: rootId,
    name: spec.name,
    parent: null,
    children: [], // TODO: [...paths.map(p => p.id), ...definitions.map(d => d.id)]
    fields: {
      specVersion: schema.openapi,
      name: spec.name,
      ...schema.info,
      servers: schema.servers || [{ url: '/' }],
    },
  }

  return {
    information,
  }
}

module.exports.spec30Converter = spec30Converter
