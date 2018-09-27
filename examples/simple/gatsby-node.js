const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`
      query {
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
      if (result.errors) {
        reject(result.errors)
      }

      result.data.allOpenApiSpec.edges.map(({ node }) => {
        createPage({
          path: `apis/${node.name}`,
          component: path.resolve(__dirname, `./src/templates/api.js`),
          context: {
            id: node.id,
          },
        })
      })

      resolve()
    })
  })
}
