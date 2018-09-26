import React from 'react'
import g from 'glamorous'
import { Link } from 'gatsby'
import Specs from '~/spec/Specs'
import { rhythm } from '~/utils/typography'
import Layout from '~/components/Layout'
import { graphql } from 'gatsby'

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

export default ({ data }) => {
  const postCount = data.allMarkdownRemark.totalCount
  const posts = data.allMarkdownRemark.edges
    .filter(e => e.node.fields)
    .map(e => toPost(e))

  const specs = data.allOpenApiSpec.edges.map(e => e.node)

  return (
    <Layout>
      <h2>Specs</h2>
      <Specs specs={specs} />
      <hr />
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
    </Layout>
  )
}

export const query = graphql`
  query IndexQuery {
    allOpenApiSpec {
      edges {
        node {
          name
          title
        }
      }
    }
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
