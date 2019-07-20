Gatsby source plugin for pulling data into Gatsby from Open API/Swagger specifications

- [Sample](/sample)

## Features

- Pulls Open API/Swagger JSON specifications from various sources, these can be local files or from HTTP services or any custom function which resolves a JSON spec
- Supports multiple specs, so useful for aggregating numerous services where the specs are co-located with each service
- Document your APIs using React!

## What's missing

This is work in progress, currently:

- No support for YAML
- Only supports Swagger version 2.0 JSON
- Various Swagger properties are not converted to fields on nodes, only the main properties (general information, paths, responses, and definitions), create an issue or PR

## Install

`npm install gatsby-source-openapi-aggregate --save`

## Configuring plugin

```javascript
// gatsby-config.js

plugins: [
  {
    resolve: `gatsby-source-openapi-aggregate`,
    options: {
      specs: [                // specs collection is required, you can define as many specs as you want
        {
          name: 'myspec',     // required, must be unique
          resolve: () => ...  // required, function which returns a Promise resolving Swagger JSON
        }
      ]
    }
  }
]
```

### Example resolve functions

Retrieving Swagger document from local file:

```javascript
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

...

  plugins: [
    {
      resolve: `gatsby-source-openapi-aggregate`,
      options: {
        specs: [
          {
            name: 'myspec',
            resolve: () => fromJson(path.resolve(__dirname, './swagger.json'))
          }
        ]
      }
    },

```

Retrieving Swagger document from HTTP request:

```javascript
const fetchSpec = async url => {
  return fetch(url).then(response => {
    if (response.status === 200) {
      return response.text()
    }

    throw new Error('There was an error retrieving document.')
  })
}
```

## How to query

The plugin adds the following collections:

- `allOpenApiSpec`
- `allOpenApiSpecPath`
- `allOpenApiSpecResponse`
- `allOpenApiSpecDefinition`

You can inspect these in GraphiQL at `http://localhost:8000/___graphql`

For example, to retrieve a list of spec names and titles ready for display:

```javascript
// src/pages/index.js

export const query = graphql`
  query IndexQuery {
    allOpenApiSpec {
      edges {
        node {
          name
          title
        }
      }
    }
    ...
```

To create a detail page for each spec:

```javascript
// gatsby-node.js

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
```

The above creates a new page for every spec defined in the plugin options, using `/apis/<name>` as the path, where `<name>` is the name you defined within the plugin options.

Each page uses the `./src/templates/api.js` React component to render the detail page. The `node.id` is passed to the context so that it is available as a GraphQL variable so that we can retreive the appropriate spec node from the `api.js` component.

```javascript
// api.js

export const query = graphql`
  query ApiQuery($id: String!) {
    openApiSpec(id: { eq: $id }) {
      version
      title
      description
      childrenOpenApiSpecPath {
        name
        verb
        summary
        description
        parameters {
          name
          in
          description
          required
          type
          format
        }
        tag
        childrenOpenApiSpecResponse {
          id
          statusCode
          description
          childrenOpenApiSpecDefinition {
            name
            properties {
              name
              type
              description
              format
            }
          }
        }
      }
    }
  }
`
```

In the above example, we're using the `$id` variable to retrieve the appropriate spec for that page. We're retreiving basic spec information (such as `version`, `title`, `description`) as well as the children paths for the spec, their associated properties, as well as each paths child responses and in turn their child definitions.

Each path has a `tags` and `tag` field - `tags` is the original array of tags associated with the path. The `tag` field is a convenience comma separated string of all tags. If you wish to display paths by tag (like Swagger UI), then you can group on this `tag` field. See the full [sample](/sample) for details.
