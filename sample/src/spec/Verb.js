import React from 'react'
import PropTypes from 'prop-types'

export const verbColor = value => {
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

export default Verb
