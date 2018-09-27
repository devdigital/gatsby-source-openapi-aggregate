const fs = require('fs')
const path = require('path')

const fromFile = filePath => {
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
          //   resolve: () =>
          //     fromFile(path.resolve(__dirname, './specs/v2.0/json/uber.json')),
          // },
          // {
          //   name: 'pet-store',
          //   resolve: () =>
          //     fromFile(
          //       path.resolve(__dirname, './specs/v2.0/json/petstore.json')
          //     ),
          // },
          // {
          //   name: 'pet-store-expanded',
          //   resolve: () =>
          //     fromFile(
          //       path.resolve(
          //         __dirname,
          //         './specs/v2.0/json/petstore-expanded.json'
          //       )
          //     ),
          // },
          // {
          //   name: 'pet-store-separate',
          //   resolve: () =>
          //     fromFile(
          //       path.resolve(
          //         __dirname,
          //         './specs/v2.0/json/petstore-separate/spec/swagger.json'
          //       )
          //     ),
          //   options: {
          //     basePath: './specs/v2.0/json/petstore-separate/spec/',
          //     resolver: {
          //       canResolve: () => true,
          //       resolve: info => fromFile(info.path),
          //     },
          //   },
          // },
          {
            name: 'v3-api-with-examples',
            resolve: () =>
              path.resolve(__dirname, './specs/v3.0/api-with-examples.yaml'),
          },
          // {
          //   name: 'v3-petstore-expanded',
          //   resolve: () =>
          //     path.resolve(__dirname, './specs/v3.0/petstore-expanded.yaml'),
          // },
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
