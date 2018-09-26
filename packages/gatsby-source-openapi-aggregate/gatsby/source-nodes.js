const omit = require('lodash.omit')
const { loggerFactory } = require('../lib/logger-factory')
const { getSpecs } = require('../lib/get-specs')

const sourceNodes = async ({ actions, reporter }, options) => {
  const { createNode } = actions

  const cleanedOptions = omit(options, 'plugins')
  console.log(cleanedOptions)

  // TODO: add option for batch size or similar on processing specs
  const specs = await getSpecs(cleanedOptions, loggerFactory(reporter))
  console.log(specs)
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
