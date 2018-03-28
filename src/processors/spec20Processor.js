const getPaths = spec => {}

const spec20Processor = async (content, { name, logger }) => {
  if (!content) {
    throw new Error(`No content to process.`)
  }

  if (!context) {
    throw new Error(`No context provided.`)
  }

  const spec = JSON.parse(content)
  if (spec.swagger !== '2.0') {
    throw new Error(`Unsupported spec version '${spec.swagger}'.`)
  }

  const rootId = `spec.${name}`

  return {
    name,
    version: spec.info ? spec.info.version : null,
    title: spec.info ? spec.info.title : null,
    description: spec.info ? spec.info.description : null,
    host: spec.host,
    schemes: spec.schemes,
    basePath: spec.basePath,
    produces: spec.produces,
    paths: getPaths(spec),
  }

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

      paths.push({
        id: `${rootId}.path.${p}.verb.${v}`,
        parent: rootId,
        children: [...pathResponses.map(pr => pr.id)],
        fields: {
          name: p,
          verb: v,
          summary: path.summary,
          description: path.description,
          parameters: path.parameters,
          tags: path.tags,
          tag: path.tags ? path.tags.join(',') : null,
        },
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
