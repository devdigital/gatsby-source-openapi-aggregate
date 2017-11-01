import React, { Component } from 'react'
import PropTypes from 'prop-types'
import remark from 'remark'
import reactRenderer from 'remark-react'
import groupBy from 'lodash.groupby'

const SpecInformation = ({ title, version, description }) => (
  <div>
    <h1>{title}</h1>
    <p>{version}</p>
    <div>
      {
        remark()
          .use(reactRenderer)
          .processSync(description).contents
      }
    </div>
  </div>
)

SpecInformation.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

const Verb = ({ value, style }) => {
  let color = null

  switch (value) {
    case 'get':
      color = '#61affe'
      break
    case 'post':
      color = '#49cc90'
      break
    case 'put':
      color = '#fca130'
      break
    case 'delete':
      color = '#f93e3e'
      break
    default:
      color = '#fff'
      break
  }

  const verbStyle = {
    padding: '0.2rem 0.5rem',
    backgroundColor: color,
    color: '#fff',
  }

  return <p style={Object.assign(verbStyle, style)}>{value.toUpperCase()}</p>
}

const SpecPath = ({ path }) => (
  <div>
    <div style={{ display: 'flex' }}>
      <Verb style={{ marginRight: '1rem' }} value={path.verb} />
      <p style={{ fontWeight: 600 }}>{path.name}</p>
      <p style={{ marginLeft: 'auto' }}>{path.summary}</p>
    </div>
    {path.description && <p>{path.description}</p>}
  </div>
)

SpecPath.propTypes = {
  path: PropTypes.object.isRequired,
}

const SpecPaths = ({ tag, paths }) => (
  <div>
    <h2>{tag}</h2>
    {paths.map(p => <SpecPath key={`${p.name}-${p.verb}`} path={p} />)}
  </div>
)

SpecPaths.propTypes = {
  tag: PropTypes.string.isRequired,
  paths: PropTypes.array.isRequired,
}

class Api extends Component {
  render() {
    const api = this.props.data.openApiSpec
    const paths = api.childrenOpenApiSpecPath
    const pathGroups = groupBy(paths, p => p.tag)

    return (
      <div>
        <SpecInformation
          title={api.title}
          version={api.version}
          description={api.description}
        />
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
      description
      childrenOpenApiSpecPath {
        name
        verb
        summary
        description
        tag
        childrenOpenApiSpecResponse {
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
