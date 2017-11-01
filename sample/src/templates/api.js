import React, { Component } from 'react'
import PropTypes from 'prop-types'
import remark from 'remark'
import reactRenderer from 'remark-react'

class Api extends Component {
  render() {
    const api = this.props.data.openApiSpec

    return (
      <div>
        <h1>{api.title}</h1>
        <p>{api.version}</p>
        <div>
          {
            remark()
              .use(reactRenderer)
              .processSync(api.description).contents
          }
        </div>
      </div>
    )
  }
}

Api.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Api

export const query = graphql`
  query ApiQuery($id: String!) {
    openApiSpec(id: { eq: $id }) {
      version
      title
      description
    }
  }
`
