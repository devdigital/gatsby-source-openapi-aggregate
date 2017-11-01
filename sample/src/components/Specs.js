import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

const Spec = ({ name, title }) => (
  <li>
    <Link to={`/apis/${name}`}>{title}</Link>
  </li>
)

Spec.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
}

const Specs = ({ specs }) => (
  <div>
    <ul>
      {specs.map(s => <Spec key={s.name} name={s.name} title={s.title} />)}
    </ul>
  </div>
)

Specs.propTypes = {
  specs: PropTypes.array.isRequired,
}

export default Specs
