import EvidenceDetail from './evidence-detail'
import PropTypes from 'prop-types'
import React from 'react'

const Evidence = ({
  description,
  fileTypeExtension,
  fileURI,
  id,
  name,
  selfHash
}) => (
  <React.Fragment>
    <tbody>
      <tr
        aria-controls={`accordion${id}`}
        aria-expanded="false"
        className="clickable"
        data-target={`#accordion${id}`}
        data-toggle="collapse"
      >
        <td>{name}</td>
        <td>
          <a href={`//${fileURI}`} rel="noopener noreferrer" target="_blank">
            {fileURI}
          </a>
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <td colSpan="5">
          <div className="collapse" id={`accordion${id}`}>
            <EvidenceDetail
              description={description}
              fileTypeExtension={fileTypeExtension}
              selfHash={selfHash}
            />
          </div>
        </td>
      </tr>
    </tbody>
  </React.Fragment>
)

Evidence.propTypes = {
  description: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default Evidence
