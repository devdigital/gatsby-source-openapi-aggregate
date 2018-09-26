const fs = require('fs')
const path = require('path')

const fromFile = filePath => () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const spec = JSON.parse(data)
      resolve(spec)
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
          // {
          //   name: 'uber',
          //   resolve: fromFile(
          //     path.resolve(__dirname, './specs/v2.0/json/uber.json')
          //   ),
          //   options: {},
          // },
          // {
          //   name: 'pet-store',
          //   resolve: fromFile(
          //     path.resolve(__dirname, './specs/v2.0/json/petstore.json')
          //   ),
          //   options: {},
          // },
          {
            name: 'pet-store-separate',
            resolve: fromFile(
              path.resolve(
                __dirname,
                './specs/v2/json/petstore-separate/spec/swagger.json'
              )
            ),
            options: {
              basePath: './specs/v2/json/petstore-separate/spec/',
              resolver: {
                canResolve: info => console.log('canResolve', info) || true,
                resolve: async info =>
                  console.log('resolve', info) || (await asJson(info.path)),
              },
            },
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
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-prismjs`,
        ],
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
