const fs = require('fs')
const path = require('path')
const omit = require('lodash.omit')
const { loggerFactory } = require('../lib/logger-factory')
const { getSpecs } = require('../lib/get-specs')

const toFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, { encoding: 'utf8', flag: 'w' }, err => {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

const sourceNodes = async ({ actions, reporter }, options) => {
  const { createNode } = actions

  const cleanedOptions = omit(options, 'plugins')

  // TODO: add option for batch size or similar on processing specs
  const specs = await getSpecs(cleanedOptions, loggerFactory(reporter))
  specs.forEach(async spec => {
    await toFile(
      path.resolve(__dirname, './output', `${spec.info.name}.json`),
      JSON.stringify(spec.schema, null, ' ')
    )
  })

  // TODO: converts specs to nodes

  // const nodeDefinitions = getNodeDefinitions(specsToProcess)
  // const nodes = getNodes(nodeDefinitions)

  // nodes.forEach(node => {
  //   createNode(node)
  // })

  // const specs = await getSpecs(cleanedOptions, loggerFactory(reporter))
  // const specsToProcess = specs.filter(s => s)
  // validateSpecs(specsToProcess)
}

module.exports = sourceNodes
