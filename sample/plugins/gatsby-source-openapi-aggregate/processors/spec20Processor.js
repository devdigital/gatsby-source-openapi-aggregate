const spec20Processor = (name, spec) => {
  const rootId = `spec.${name}`

  const definitions = Object.keys(spec.definitions).map(d => {
    const definition = spec.definitions[d]
    return {
      id: `${rootId}.definition.${d}`,
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
            example: property.example,
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

        let ref = null

        if (response.schema) {
          ref =
            response.schema.type === 'array'
              ? response.schema.items.$ref
              : response.schema.$ref
        }

        const definitionId = ref ? ref.replace('#/definitions/', '') : null

        return {
          id: `${rootId}.path.${p}.verb.${v}.response.${r}`,
          parent: `${rootId}.path.${p}.verb.${v}`,
          children: definitionId
            ? [`${rootId}.definition.${definitionId}`]
            : [],
          fields: {
            statusCode: r,
            description: response.description,
          },
        }
      })

      pathResponses.forEach(r => {
        responses.push(r)
      })

      let xfields = {}

      // copy x-* extension properties 
      for (key in path) {
        if (key.startsWith('x-')) {
          // convert snake-case to snake_case
          snake_case = key.replace(/-/g, "_");
          xfields[snake_case] = path[key]
        }
      }
      
      paths.push({
        id: `${rootId}.path.${p}.verb.${v}`,
        parent: rootId,
        children: [...pathResponses.map(pr => pr.id)],
        fields: Object.assign({
          name: p,
          verb: v,
          summary: path.summary,
          description: path.description,
          parameters: path.parameters,
          tags: path.tags,
          tag: path.tags ? path.tags.join(',') : null,
          operationId: path.operationId,
          fullPath: spec.basePath + p,
          consumes: path.consumes,
          produces: path.produces,
          schemes: path.schemes,
          deprecated: path.deprecated,
        }, xfields)
      })
    })
  })

  const information = {
    id: rootId,
    parent: null,
    children: [...paths.map(p => p.id), ...definitions.map(d => d.id)],
    fields: {
      name,
      version: spec.info.version,
      title: spec.info.title,
      description: spec.info.description,
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
}

module.exports = spec20Processor
