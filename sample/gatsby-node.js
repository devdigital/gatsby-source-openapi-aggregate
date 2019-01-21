const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.modifyWebpackConfig = ({ config }) => {
  config.merge({
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  })

  return config
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allOpenApiSpec {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `).then(result => {
      result.data.allOpenApiSpec.edges.map(({ node }) => {
        createPage({
          path: `apis/${node.name}`,
          component: path.resolve(`./src/templates/api.js`),
          context: {
            id: node.id,
          },
        })
      })

      resolve()
    })
  })
}
