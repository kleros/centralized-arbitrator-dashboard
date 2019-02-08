import PropTypes from 'prop-types'
import React from 'react'

const EvidenceDetail = ({ description }) => (
  <div className="row">
    <div className="col text-center">
      <h4 className="">{description}</h4>
    </div>
  </div>
)

EvidenceDetail.propTypes = {
  description: PropTypes.string.isRequired
}

export default EvidenceDetail
