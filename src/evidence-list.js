import PropTypes from 'prop-types'
import React from 'react'

import Evidence from './evidence'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
  }

  evidences = (name, evidences) => {
    const items = evidences.map(item => (
      <Evidence
        key={name}
        name={name}
        description={item && item.description}
        fileURI={item && item.fileURI}
      />
    ))

    return items
  }

  render() {
    const { name, evidences } = this.props
    if (!evidences) return <h4>No Evidence From {name}</h4>

    return (
      <div>
        <table className="table table-hover evidence-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>File URI</th>
            </tr>
          </thead>
          {this.evidences(name, evidences)}
        </table>
      </div>
    )
  }
}

EvidenceList.propTypes = {
  name: PropTypes.string.isRequired,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default EvidenceList
