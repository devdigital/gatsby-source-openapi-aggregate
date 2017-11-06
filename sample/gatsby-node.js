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

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    if (!node.fileAbsolutePath) {
      return
    }

    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
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
