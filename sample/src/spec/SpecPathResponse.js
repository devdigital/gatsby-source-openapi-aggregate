import React from 'react'
import PropTypes from 'prop-types'
import SpecDefinition from './SpecDefinition'

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

export default SpecPathResponse
