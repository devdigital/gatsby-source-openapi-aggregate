const spec20Processor = (name, spec) => {
  const rootId = name

  const definitions = Object.keys(spec.definitions).map(d => {
    const definition = spec.definitions[d]
    return {
      id: `${name}.${d}`,
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
  Object.keys(spec.paths).forEach(k => {
    Object.keys(spec.paths[k]).forEach(v => {
      const path = spec.paths[k][v]
      const pathResponses = Object.keys(path.responses).map(r => {
        const response = path.responses[r]

        const ref =
          response.schema.type === 'array'
            ? response.schema.items.$ref
            : response.schema.$ref

        const definitionId = ref.replace('#/definitions/', '')

        return {
          id: `${k}.${v}.${r}`,
          parent: k,
          children: [`${name}.${definitionId}`],
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
        id: k,
        parent: rootId,
        children: [...pathResponses.map(pr => pr.id)],
        fields: {
          name: k,
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
