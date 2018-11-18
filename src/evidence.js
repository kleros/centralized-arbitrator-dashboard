import React from 'react'
import PropTypes from 'prop-types'

import EvidenceDetail from './evidence-detail'

const Evidence = ({
  name,
  id,
  description,
  fileURI,
  fileTypeExtension,
  selfHash
}) => (
  <React.Fragment>
    <tbody>
      <tr
        className="clickable"
        data-toggle="collapse"
        data-target={'#accordion' + id}
        aria-expanded="false"
        aria-controls={'accordion' + id}
      >
        <td>{name}</td>
        <td>
          <a href={'//' + fileURI} target="_blank" rel="noopener noreferrer">
            {fileURI}
          </a>
        </td>
      </tr>
    </tbody>
    <tbody>
      <tr>
        <td colSpan="5">
          <div id={'accordion' + id} className="collapse">
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
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default Evidence
