import Evidence from "./Evidence"
//import Identicon from "./Identicon"
//import Archon from "@kleros/archon"
import { EvidenceType } from "../types"
import { FC } from "react"

const EvidenceList: FC<{
  evidences: EvidenceType[]
  ipfsGateway: string
  //address
  //aliases
  //archon
  //name
}> = (p) => {
  const isEvidenceIntegrityOK = (evidences: EvidenceType[]) => {
    if (evidences.length === 0) return true
    return evidences
      .map((evidence) => evidence.fileValid)
      .reduce((op1, op2) => op1 && op2)
  }

  if (p.evidences.length > 0)
    return (
      <div>
        <div className="row m-1">
          <div className="col">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
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
                    {p.evidences.length > 0 &&
                      p.evidences.map((e: EvidenceType) => (
                        <Evidence
                          //description={e.evidenceJSON.description}
                          //evidenceJSONValid={e.evidenceJSONValid}
                          //fileHash={e.evidenceJSON.fileHash}
                          fileURI={e.evidenceJSON.fileURI}
                          ipfsGateway={p.ipfsGateway}
                          key={e.evidenceJSON.name + e.evidenceJSON.fileURI}
                          name={e.evidenceJSON.name}
                        />
                      ))}
                  </div>
                  {!isEvidenceIntegrityOK(p.evidences) && (
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-md-8 py-2 ">
                          <h6 className="">Integrity Broken!</h6>
                        </div>
                        <div className="col-md-3 ">
                          <img alt="warning" className="" src="warning.svg" />
                        </div>
                        <div className="offset-md-1" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else return null
}

export default EvidenceList
