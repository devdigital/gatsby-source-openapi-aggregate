const fs = require('fs')
const path = require('path')

const fromJson = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data)
    })
  })
}

module.exports = {
  siteMetadata: {
    title: `OpenAPI Aggregate`,
  },
  plugins: [
    {
      resolve: `gatsby-source-openapi-aggregate`,
      options: {
        specs: [
          {
            name: 'uber',
            resolve: () =>
              fromJson(path.resolve(__dirname, './data/swagger-uber.json')),
          },
          {
            name: 'pet-store',
            resolve: () =>
              fromJson(path.resolve(__dirname, './data/swagger-petstore.json')),
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-glamor`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
