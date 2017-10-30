import React from 'react'
import g from 'glamorous'
import Link from 'gatsby-link'

import { rhythm } from '../utils/typography'

const toPost = edge => ({
  slug: edge.node.fields.slug,
  title: edge.node.frontmatter.title,
  date: edge.node.frontmatter.date,
  excerpt: edge.node.excerpt,
})

const Post = ({ slug, title, date, excerpt }) => (
  <div>
    <Link to={slug} css={{ textDecoration: `none`, color: `inherit` }}>
      <g.H3 marginBottom={rhythm(1 / 4)}>
        {title} <g.Span color="#BBB">— {date}</g.Span>
      </g.H3>
      <p>{excerpt}</p>
    </Link>
  </div>
)

const Spec = ({ id, title }) =>
  <div>
    <p>{id}</p>
    <p>{title}</p>
  </div>

Spec.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}


const Specs = ({ specs }) =>
  <div>
    {specs.map(s => <Spec key={s.id} id={s.id} title={s.title} />)}
  </div>

Specs.propTypes = {
  specs: PropTypes.array.isRequired
}

export default ({ data }) => {
  const postCount = data.allMarkdownRemark.totalCount
  const posts = data.allMarkdownRemark.edges
    .filter(e => e.node.fields)
    .map(e => toPost(e))

  const specs = data.allOpenApiSpec.edges

  return (
    <div>
      <Specs specs={specs} />
      <h2>Posts</h2>
      {posts.map((p, i) => (
        <Post
          key={`post-${i}`}
          slug={p.slug}
          title={p.title}
          date={p.date}
          excerpt={p.excerpt}
        />
      ))}
    </div>
  )
}

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
