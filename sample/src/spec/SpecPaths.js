import React from 'react'
import PropTypes from 'prop-types'
import Markdown from '~/common/Markdown'
import Verb, { verbColor } from './Verb'
import SpecPathResponse from './SpecPathResponse'
import SpecPathParameters from './SpecPathParameters'

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

export default SpecPaths
