const spec20Converter = async (spec, schema) => {
  const rootId = `spec.${spec.name}`

  const information = {
    id: rootId,
    parent: null,
    children: [], // TODO: [...paths.map(p => p.id), ...definitions.map(d => d.id)]
    fields: {
      name: spec.name,
      ...schema.info,
    },
  }

  return {
    information,
  }
}

module.exports.spec20Converter = spec20Converter
