import React from 'react'
import Specs from '~/spec/Specs'

export default ({ data }) => {
  const specs = data.allOpenApiSpec.edges.map(e => e.node)

  return (
    <div>
      <h2>Specs</h2>
      <Specs specs={specs} />
      <hr />
    </div>
  )
}

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
  }
`
