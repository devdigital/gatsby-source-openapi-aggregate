Gatsby source plugin for pulling data into Gatsby from Open API/Swagger specifications

* [Sample](/sample)

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

`npm install gatsbsy-source-openapi-aggregate --save`

## Configuring plugin

```javascript
// gatsby-config.js

plugins: [
  {
    resolve: `gatsby-source-openapi-aggregate`,
    options: {
      specs: [
        {
          name: 'myspec',   // required, must be unique
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

      specs: [
        {
          name: 'myspec',
          resolve: () => fromJson(path.resolve(__dirname, './swagger.json'))
        }
      ]

```

TODO: example retrieving JSON from HTTP request
