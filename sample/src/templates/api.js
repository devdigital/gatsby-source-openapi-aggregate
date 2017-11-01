import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Api extends Component {
  render() {
    const api = this.props.data.openApiSpec

    return (
      <div>
        <h1>{api.title}</h1>
        <p>{api.version}</p>
        <p>{api.description}</p>
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
