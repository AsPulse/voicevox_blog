import { graphql, useStaticQuery } from "gatsby"
import React from "react"
import "../components/layout.scss"
import { Page } from "../components/page"
import Seo from "../components/seo"

export default () => {
  const data: {
    allUpdateInfosJson: {
      edges: [
        {
          node: {
            version: string
            descriptions: Array<string>
            contributors: Array<string>
          }
        }
      ]
    }
  } = useStaticQuery(graphql`
    query {
      allUpdateInfosJson {
        edges {
          node {
            version
            descriptions
            contributors
          }
        }
      }
    }
  `)
  const events = data.allUpdateInfosJson.edges.map(edge => {
    return edge.node
  })
  return (
    <Page>
      <Seo
        title="変更履歴 | VOICEVOX"
        description="VOICEVOXソフトウェアの変更履歴です"
        // image={shareThumb}
      />
      <section className="section">
        <div className="container is-max-desktop">
          <div className="update-history">
            <h1 className="title">変更履歴</h1>
            {events.map((e, index) => (
              <>
                <div key={index}>
                  <h2 className="subtitle is-4">ver {e.version}</h2>
                  <ul>
                    {e.descriptions.map((d, index) => (
                      <li key={index}>{d}</li>
                    ))}
                  </ul>
                  <h3 className="title is-5">貢献者リスト</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: e.contributors.join(" / "),
                    }}
                  />
                </div>
                {events.length !== index + 1 && <hr />}
              </>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
