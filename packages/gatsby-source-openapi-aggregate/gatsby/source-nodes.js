const omit = require('lodash.omit')
const { loggerFactory } = require('../lib/logger-factory')
const { getSpecs } = require('../lib/get-specs')
const { convertSpecsToNodes } = require('./convert-to-nodes')
const { outputSpecs } = require('./output-specs')

const sourceNodes = async ({ actions, reporter }, options) => {
  const { createNode } = actions

  const cleanedOptions = omit(options, 'plugins')

  // TODO: add option for batch size or similar on processing specs
  const specs = await getSpecs(cleanedOptions, loggerFactory(reporter))

  await outputSpecs(specs) // TODO: remove

  const nodes = convertSpecsToNodes(specs.map(s => s.schema))

  nodes.forEach(n => {
    createNode(n)
  })
}

module.exports = sourceNodes
