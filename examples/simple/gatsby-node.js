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
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      // allOpenApiSpec {
      //   edges {
      //     node {
      //       id
      //       name
      //     }
      //   }
      // }

      // result.data.allOpenApiSpec.edges.map(({ node }) => {
      //   createPage({
      //     path: `apis/${node.name}`,
      //     component: path.resolve(`./src/templates/api.js`),
      //     context: {
      //       id: node.id,
      //     },
      //   })
      // })

      result.data.allMarkdownRemark.edges.map(({ node }) => {
        if (!node.fields) {
          return
        }

        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
}
