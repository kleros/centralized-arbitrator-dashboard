import { FC } from "react"
import { EvidenceType } from "../types"
// eslint-disable-next-line @typescript-eslint/no-var-requires
//import mime from 'mime-types'

const Evidence: FC<{
  evidence: EvidenceType
  ipfsGateway: string
}> = (p) => {
  const showOptions = () => {
    if (!p.evidence.evidenceJSON.fileURI) {
      return null
    }
    return (
      <a
        href={p.ipfsGateway + p.evidence.evidenceJSON?.fileURI}
        rel="noopener noreferrer"
        target="_blank"
        style={{ fontSize: "0.8em" }}
      >
        <>- See attached file</>
      </a>
    )
  }

  return (
    <div style={{ fontSize: "0.6em" }}>
      <br></br>
      <strong>• {p.evidence.evidenceJSON?.name}</strong> {showOptions()}
      <br></br>
      {p.evidence.evidenceJSON?.description}
      <br></br>
      <br></br>
    </div>
  )
}

export default Evidence
