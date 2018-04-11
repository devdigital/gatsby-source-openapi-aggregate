const isString = require('inspected/schema/is-string').default
const isRequired = require('inspected/schema/is-required').default

const getPaths = spec => {
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
}

const isReferenceObject = obj => {
  if (!obj) {
    return false
  }

  return obj.hasOwnProperty('$ref')
}

// const getReferenceId =

const resolveReference = (definitions, ref) => {
  if (!ref) {
    throw new Error('There was an unexpected empty ref value.')
  }

  if (ref.startsWith('#/definitions/')) {
    const definitionId = ref.substring('#/definitions/'.length)
    if (definitions.hasOwnProperty(definitionId)) {
      return definitions[definitionId]
    }

    throw new Error(`Local definition with value ${ref} not found.`)
  }

  throw new Error(`Reference value of ${ref} not currently supported.`)
}

const getResponseDetails = (responses, responseId, response) => {
  if (isReferenceObject(response)) {
    const ref = response['$ref']
    return {
      id: getReferenceId(ref),
      ...resolveReference(responses, ref),
    }
  }

  return {
    id: responseId,
    ...response,
  }
}

const getResponses = spec => {
  const responses = []

  Object.keys(spec.paths).forEach(p => {
    Object.keys(spec.paths[p]).forEach(v => {
      const path = spec.paths[p][v]
      const pathResponses = Object.keys(path.responses).map(r => {
        const response = path.responses[r]
        const responseDetails = getResponseDetails(spec.responses, response)

        const existingResponse = responses.find(
          r => r.id === responseDetails.id
        )
        if (!existingResponse) {
          responses.push(responseDetails)
        }
      })
    })
  })

  return responses
}

// Specifications
// https://swagger.io/docs/specification/2-0/basic-structure/
// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md

// Examples
// https://github.com/OAI/OpenAPI-Specification/tree/master/examples/v2.0/json
const spec20Processor = async (content, context) => {
  if (!isRequired(isString)(content)) {
    throw new Error(`No content to process.`)
  }

  if (!context) {
    throw new Error(`No context provided.`)
  }

  const spec = JSON.parse(content)
  if (spec.swagger !== '2.0') {
    throw new Error(`Unsupported spec version '${spec.swagger}'.`)
  }

  const responses = getResponses(spec)
  console.log(responses)

  return {}

  // const rootId = `spec.${name}`

  const information = {
    name: context.name,
    version: spec.info ? spec.info.version : null,
    title: spec.info ? spec.info.title : null,
    description: spec.info ? spec.info.description : null,
    host: spec.host,
    schemes: spec.schemes,
    basePath: spec.basePath,
    produces: spec.produces,
  }

  const paths = getPaths(spec)

  return {
    information,
    paths,
    responses,
    definitions,
  }

  // const definitions = Object.keys(spec.definitions).map(d => {
  //   const definition = spec.definitions[d]
  //   return {
  //     id: `${rootId}.definition.${d}`,
  //     parent: rootId,
  //     children: [],
  //     fields: {
  //       name: d,
  //       properties: Object.keys(definition.properties).map(k => {
  //         const property = definition.properties[k]
  //         return {
  //           name: k,
  //           type: property.type,
  //           description: property.description,
  //           format: property.format,
  //         }
  //       }),
  //     },
  //   }
  // })

  // const paths = []
  // const responses = []
  // Object.keys(spec.paths).forEach(p => {
  //   Object.keys(spec.paths[p]).forEach(v => {
  //     const path = spec.paths[p][v]
  //     const pathResponses = Object.keys(path.responses).map(r => {
  //       const response = path.responses[r]

  //       let ref = null

  //       if (response.schema) {
  //         ref =
  //           response.schema.type === 'array'
  //             ? response.schema.items.$ref
  //             : response.schema.$ref
  //       }

  //       const definitionId = ref ? ref.replace('#/definitions/', '') : null
  //       return {
  //         id: `${rootId}.path.${p}.verb.${v}.response.${r}`,
  //         parent: `${rootId}.path.${p}.verb.${v}`,
  //         children: definitionId
  //           ? [`${rootId}.definition.${definitionId}`]
  //           : [],
  //         fields: {
  //           statusCode: r,
  //           description: response.description,
  //         },
  //       }
  //     })

  //     pathResponses.forEach(r => {
  //       responses.push(r)
  //     })

  //     paths.push({
  //       id: `${rootId}.path.${p}.verb.${v}`,
  //       parent: rootId,
  //       children: [...pathResponses.map(pr => pr.id)],
  //       fields: {
  //         name: p,
  //         verb: v,
  //         summary: path.summary,
  //         description: path.description,
  //         parameters: path.parameters,
  //         tags: path.tags,
  //         tag: path.tags ? path.tags.join(',') : null,
  //       },
  //     })
  //   })
  // })

  // const information = {
  //   id: rootId,
  //   parent: null,
  //   children: [...paths.map(p => p.id), ...definitions.map(d => d.id)],
  //   fields: {
  //     name,
  //     version: spec.info.version,
  //     title: spec.info.title,
  //     description: spec.info.description,
  //     host: spec.host,
  //     schemes: spec.schemes,
  //     basePath: spec.basePath,
  //     produces: spec.produces,
  //   },
  // }

  // return {
  //   information,
  //   paths,
  //   responses,
  //   definitions,
  // }
}

exports.spec20Processor = spec20Processor
