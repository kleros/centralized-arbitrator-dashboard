import PropTypes from 'prop-types'
import React from 'react'

const EvidenceDetail = ({ description, fileTypeExtension, selfHash }) => (
  <div>
    <h5>{'Description: ' + description}</h5>
    <h5>{'Extension: ' + fileTypeExtension}</h5>
    <h5>{'Self Hash: ' + selfHash}</h5>
  </div>
)

EvidenceDetail.propTypes = {
  description: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default EvidenceDetail
