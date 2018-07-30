const oai = require('oai-ts-core')
const isString = require('inspected/schema/is-string').default
const isRequired = require('inspected/schema/is-required').default

const oaiTsCoreProcessor = async (content, context) => {
  if (!isRequired(isString)(content)) {
    throw new Error(`No content to process.`)
  }

  if (!context) {
    throw new Error(`No context provided.`)
  }

  const library = new oai.OasLibraryUtils()
  const document = library.createDocument(content)
  console.log(document.definitions)
}

exports.oaiTsCoreProcessor = oaiTsCoreProcessor
