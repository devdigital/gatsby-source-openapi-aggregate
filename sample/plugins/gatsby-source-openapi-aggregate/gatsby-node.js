const crypto = require(`crypto`)

const toHash = value => {
  return crypto
    .createHash(`md5`)
    .update(value)
    .digest(`hex`)
}

const spec20Processor = (name, spec) => {

  const paths = Object.keys(spec.paths).map(k => ({
    id: k,
    
  }))

  return [
    {
      id: name,
      parent: null,
      children: ['description'],
      fields: {
        version: spec.info.version,
        title: spec.info.title,
        host: spec.host,
        schemes: spec.schemes,
        basePath: spec.basePath,
        produces: spec.produces
      },
    },
    {
      id: 'description',
      parent: name,
      children: [],
      meta: {
        mediaType: 'text/markdown',
        content: spec.info.description,
      },
    },
  ]
}

const specProcessorFactory = spec => {
  if (spec.swagger === '2.0') {
    return spec20Processor
  }

  throw new Error(`Unsupported spec ${spec.swagger}`)
}

exports.sourceNodes = async ({ boundActionCreators }, options) => {
  const { createNode } = boundActionCreators

  // TODO: validate options
  options.specs.forEach(async spec => {
    let jsonText = null
    try {
      jsonText = await spec.resolve()
    } catch (exception) {
      console.warn(
        `There was an error resolving spec '${spec.name}', ${exception.name} ${exception.message}`
      )
    }

    if (jsonText === null) {
      return
    }

    try {
      const json = JSON.parse(jsonText)
      const processor = specProcessorFactory(json)
      const result = processor(spec.name, json)
      const nodes = result.map(n => {
        const node = Object.assign(
          {
            id: `__openapi__${n.id}`,
            parent: n.parent ? `__openapi__${n.parent}` : null,
            children: n.children.map(c => `__openapi__${c}`),
            internal: {
              type: `OpenApiSpec`,
            },
          },
          n.fields
        )

        if (n.meta) {
          node.internal.contentDigest = toHash(n.meta.content)
          node.internal.mediaType = n.meta.mediaType
          node.internal.content = n.meta.content
        } else {
          node.internal.contentDigest = toHash(JSON.stringify(n.fields))
        }

        return node
      })

      nodes.forEach(n => {
        createNode(n)
      })
    } catch (exception) {
      console.warn(
        `There was an error processing spec '${spec.name}', ${exception.name} ${exception.message}`
      )
    }
  })
}
