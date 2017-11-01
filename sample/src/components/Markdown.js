import React from 'react'
import PropTypes from 'prop-types'
import remark from 'remark'
import reactRenderer from 'remark-react'

const Markdown = ({ markdown }) => (
  <div>
    {
      remark()
        .use(reactRenderer)
        .processSync(markdown).contents
    }
  </div>
)

Markdown.propTypes = {
  markdown: PropTypes.string.isRequired,
}

export default Markdown
