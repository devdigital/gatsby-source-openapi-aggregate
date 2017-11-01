const spec20Processor = (name, spec) => {
  const rootId = name

  const definitions = Object.keys(spec.definitions).map(d => {
    const definition = spec.definitions[d]
    return {
      id: `${name}.definition.${d}`,
      parent: rootId,
      children: [],
      fields: {
        name: d,
        properties: Object.keys(definition.properties).map(k => {
          const property = definition.properties[k]
          return {
            name: k,
            type: property.type,
            description: property.description,
            format: property.format,
          }
        }),
      },
    }
  })

  const paths = []
  const responses = []
  Object.keys(spec.paths).forEach(p => {
    Object.keys(spec.paths[p]).forEach(v => {
      const path = spec.paths[p][v]
      const pathResponses = Object.keys(path.responses).map(r => {
        const response = path.responses[r]

        const ref =
          response.schema.type === 'array'
            ? response.schema.items.$ref
            : response.schema.$ref

        const definitionId = ref.replace('#/definitions/', '')

        return {
          id: `${name}.path.${p}.response.${v}.${r}`,
          parent: `${name}.path.${p}`,
          children: [`${name}.definition.${definitionId}`],
          fields: {
            statusCode: r,
            description: response.description,
          },
        }
      })

      pathResponses.forEach(r => {
        responses.push(r)
      })

      paths.push({
        id: `${name}.path.${p}`,
        parent: rootId,
        children: [...pathResponses.map(pr => pr.id)],
        fields: {
          name: p,
          verb: v,
          summary: path.summary,
          description: path.description,
          parameters: path.parameters,
          tags: path.tags,
        },
      })
    })
  })

  const information = {
    id: rootId,
    parent: null,
    children: [...paths.map(p => p.id), ...definitions.map(d => d.id)],
    fields: {
      version: spec.info.version,
      title: spec.info.title,
      host: spec.host,
      schemes: spec.schemes,
      basePath: spec.basePath,
      produces: spec.produces,
    },
  }

  return {
    information,
    paths,
    responses,
    definitions,
  }

  // return [
  //   root,
  //   ...paths,
  //   {
  //     id: 'description',
  //     parent: rootId,
  //     children: [],
  //     meta: {
  //       mediaType: 'text/markdown',
  //       content: spec.info.description,
  //     },
  //   },
  // ]
}

module.exports = spec20Processor
