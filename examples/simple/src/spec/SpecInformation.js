import React from 'react'
import PropTypes from 'prop-types'
import Markdown from '~/common/Markdown'

const SpecInformation = ({ title, version, description }) => (
  <div>
    <h1>{title}</h1>
    <p>Version: {version}</p>
    {description && <Markdown markdown={description} />}
  </div>
)

SpecInformation.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  description: PropTypes.string,
}

export default SpecInformation
