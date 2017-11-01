import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Markdown from '../components/Markdown'
import groupBy from 'lodash.groupby'

const SpecInformation = ({ title, version, description }) => (
  <div>
    <h1>{title}</h1>
    <p>{version}</p>
    <Markdown markdown={description} />
  </div>
)

SpecInformation.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

const verbColor = value => {
  switch (value) {
    case 'get':
      return {
        foreground: '#61affe',
        background: 'rgba(97,175,254,.1)',
      }
    case 'post':
      return {
        foreground: '#49cc90',
        background: 'rgba(73,204,144,.1)',
      }
    case 'put':
      return {
        foreground: '#fca130',
        background: 'rgba(252,161,48,.1)',
      }
    case 'delete':
      return {
        foreground: '#f93e3e',
        background: 'rgba(249,62,62,.1)',
      }
    default:
      return {
        foreground: '#fff',
        background: '#fff',
      }
  }

  return color
}

const Verb = ({ value, style }) => {
  const verbStyle = {
    padding: '0.2rem 0.5rem',
    backgroundColor: verbColor(value).foreground,
    color: '#fff',
  }

  return <p style={Object.assign(verbStyle, style)}>{value.toUpperCase()}</p>
}

const SpecDefinitionProperty = ({ name, type, description, format }) => (
  <tr>
    <td>{name}</td>
    <td>{type}</td>
    <td>{description}</td>
    <td>{format}</td>
  </tr>
)

SpecDefinitionProperty.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  description: PropTypes.string,
  format: PropTypes.string,
}

const SpecDefinition = ({ definition }) =>
  console.log(definition) || (
    <div>
      <p>{definition.name}</p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          {definition.properties.map((p, i) => (
            <SpecDefinitionProperty
              key={`property-${i}`}
              name={p.name}
              type={p.type}
              description={p.description}
              format={p.format}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
SpecDefinition.propTypes = {
  definition: PropTypes.object.isRequired,
}

const SpecPathResponse = ({ statusCode, description, definitions }) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <p style={{ marginRight: '1rem' }}>{statusCode}</p>
        <p>{description}</p>
      </div>
      {definitions.length === 1 ? (
        <SpecDefinition definition={definitions[0]} />
      ) : null}
    </div>
  )
}

SpecPathResponse.propTypes = {
  statusCode: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  definitions: PropTypes.array.isRequired,
}

const SpecPathParameter = ({
  name,
  source,
  description,
  type,
  format,
  required,
}) => {
  const superScriptStyle = {
    position: 'relative',
    top: '-0.5em',
    fontSize: '0.6rem',
    color: 'rgba(255,0,0,.6)',
  }

  return (
    <tr>
      <td>
        <p>
          {name} {required && <span style={superScriptStyle}>* required</span>}
        </p>
        {type && <p style={{ fontWeight: 600 }}>{type}</p>}
        {source && (
          <p>
            <em>({source})</em>
          </p>
        )}
      </td>
      <td>{description}</td>
    </tr>
  )
}

SpecPathParameter.propTypes = {
  name: PropTypes.string.isRequired,
  source: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string,
  format: PropTypes.string,
  required: PropTypes.bool,
}

const SpecPathParameters = ({ parameters }) => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {parameters.map((p, i) => (
        <SpecPathParameter
          key={`parameter-${i}`}
          name={p.name}
          source={p.in}
          description={p.description}
          type={p.type}
          format={p.format}
          required={p.required}
        />
      ))}
    </tbody>
  </table>
)

SpecPathParameters.propTypes = {
  parameters: PropTypes.array.isRequired,
}

const pathStyle = verb => ({
  padding: '1rem',
  borderRadius: '4px',
  border: `2px solid ${verbColor(verb).background}`,
  backgroundColor: verbColor(verb).background,
})

const SpecPath = ({ path }) => {
  const responses = path.childrenOpenApiSpecResponse

  return (
    <div style={pathStyle(path.verb)}>
      <div style={{ display: 'flex' }}>
        <Verb style={{ marginRight: '1rem' }} value={path.verb} />
        <p style={{ fontWeight: 600 }}>{path.name}</p>
        <p style={{ marginLeft: 'auto' }}>{path.summary}</p>
      </div>
      {path.parameters && <SpecPathParameters parameters={path.parameters} />}
      {path.description && <Markdown markdown={path.description} />}
      <h3>Responses</h3>
      {responses.map(r => (
        <SpecPathResponse
          key={r.id}
          statusCode={r.statusCode}
          description={r.description}
          definitions={r.childrenOpenApiSpecDefinition}
        />
      ))}
    </div>
  )
}

SpecPath.propTypes = {
  path: PropTypes.object.isRequired,
}

const SpecPaths = ({ tag, paths }) => (
  <div>
    <h2>{tag}</h2>
    {paths.map(p => (
      <div key={`${p.name}-${p.verb}`} style={{ marginBottom: '1rem' }}>
        <SpecPath path={p} />
      </div>
    ))}
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
