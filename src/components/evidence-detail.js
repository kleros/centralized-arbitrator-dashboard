import PropTypes from 'prop-types'
import React from 'react'

const EvidenceDetail = ({ description, fileTypeExtension, selfHash }) => (
  <div className="row">
    <div className="col text-center">
      <h4 className="">{description}</h4>
    </div>
  </div>
)

EvidenceDetail.propTypes = {
  description: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default EvidenceDetail
