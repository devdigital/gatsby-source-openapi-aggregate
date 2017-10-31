const crypto = require(`crypto`)

const toHash = value => {
  return crypto
    .createHash(`md5`)
    .update(value)
    .digest(`hex`)
}

const spec20Processor = (name, spec) => {
  const rootId = name

  const paths = []

  Object.keys(spec.paths).forEach(k => {
    Object.keys(spec.paths[k]).forEach(v => {
      const path = spec.paths[k][v]
      paths.push({
        id: k,
        parent: rootId,
        children: [],
        fields: {
          verb: v,
          summary: path.summary,
        },
      })
    })
  })

  const root = {
    id: rootId,
    parent: null,
    children: [...paths.map(p => p.id)],
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
    spec: root,
    paths: paths,
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

const specProcessorFactory = spec => {
  if (spec.swagger === '2.0') {
    return spec20Processor
  }

  throw new Error(`Unsupported spec ${spec.swagger}`)
}

const toNode = (data, type) => {
  const openApiPrefix = '__openapi__'

  if (!data.hasOwnProperty('parent')) {
    throw new Error('Data object has no parent property')
  }

  if (!data.hasOwnProperty('children') || !Array.isArray(data.children)) {
    throw new Error('Data object has no children array property')
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
      console.log('result', result)

      // { spec, paths }
      const nodes = []
      nodes.push(toNode(result.spec, 'OpenApiSpec'))
      result.paths.forEach(p => {
        nodes.push(toNode(p, 'OpenApiSpecPath'))
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
