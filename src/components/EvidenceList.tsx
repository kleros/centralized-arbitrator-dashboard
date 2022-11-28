import Evidence from "./Evidence"
import { EvidenceType } from "../types"
import { FC } from "react"

const EvidenceList: FC<{
  evidenceArray: EvidenceType[]
  ipfsGateway: string
}> = (p) => {
  if (p.evidenceArray?.length > 0)
    return (
      <div>
        <div className="row m-1">
          <div className="col">
            <ul className="nav nav-tabs" id="myTab">
              <li className="nav-item">
                <a
                  aria-controls="evidence"
                  aria-selected="true"
                  className="nav-link active"
                  data-toggle="tab"
                  href="#evidence"
                  id="evidence-tab"
                  rel="noopener noreferrer"
                  role="tab"
                  target="_blank"
                >
                  <h6 className="secondary-inverted">
                    <b>Evidences</b>
                  </h6>
                </a>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                aria-labelledby="home-tab"
                className="tab-pane fade show active"
                id="evidence"
                role="tabpanel"
              >
                <div className="row">
                  <div className="col-md-8 text-left">
                    {p.evidenceArray.length > 0 &&
                      p.evidenceArray.map((e: EvidenceType) => {
                        return (
                          <Evidence
                            evidence={e}
                            ipfsGateway={p.ipfsGateway}
                            key={e.submittedAt}
                          />
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  return null
}

export default EvidenceList
