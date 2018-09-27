import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import groupBy from 'lodash.groupby'
import SpecInformation from '~/spec/SpecInformation'
import SpecPaths from '~/spec/SpecPaths'
import g from 'glamorous'
import { graphql } from 'gatsby'

const backStyle = {
  marginBottom: '1rem',
}

class Api extends Component {
  render() {
    const api = this.props.data.openApiSpec
    const paths = api.childrenOpenApiSpecPath
    const pathGroups = groupBy(paths, p => p.tag)

    return (
      <div>
        <g.Div css={backStyle}>
          <Link to="/">Back</Link>
        </g.Div>
        <SpecInformation title={api.title} version={api.version} />
        {Object.keys(pathGroups).map(t => (
          <SpecPaths key={t} tag={t} paths={pathGroups[t]} />
        ))}
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
    }
  }
`
