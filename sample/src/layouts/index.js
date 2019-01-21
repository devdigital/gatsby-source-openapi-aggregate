import React, { Component } from 'react'
import glamorous from 'glamorous'
import { rhythm } from '~/utils/typography'
import 'prismjs/themes/prism-solarizedlight.css'
import './index.css'

const Content = glamorous.div({
  maxWidth: 900,
  padding: rhythm(2),
  paddingTop: rhythm(1.5),
})

class App extends Component {
  render() {
    const { data, children } = this.props
    return (
      <div>
        <Content>{children()}</Content>
      </div>
    )
  }
}

export default App

export const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
