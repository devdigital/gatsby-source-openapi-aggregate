import React from 'react'
import glamorous from 'glamorous'
import { rhythm } from '~/utils/typography'
import { StaticQuery, graphql } from 'gatsby'
import 'prismjs/themes/prism-solarizedlight.css'
import './layout.css'

const Content = glamorous.div({
  maxWidth: 900,
  padding: rhythm(2),
  paddingTop: rhythm(1.5),
})

export default ({ children }) => (
  <StaticQuery
    query={graphql`
      query LayoutQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={() => (
      <>
        <Content>{children}</Content>
      </>
    )}
  />
)
