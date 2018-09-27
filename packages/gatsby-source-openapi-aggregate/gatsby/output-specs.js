const fs = require('fs')
const path = require('path')

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

const outputSpecs = async specs => {
  specs.forEach(async spec => {
    await toFile(
      path.resolve(__dirname, './output', `${spec.info.name}.json`),
      JSON.stringify(spec.schema, null, ' ')
    )
  })
}

module.exports.outputSpecs = outputSpecs
