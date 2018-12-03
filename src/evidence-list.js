import Evidence from './evidence'
import PropTypes from 'prop-types'
import React from 'react'

class EvidenceList extends React.Component {
  evidences = (name, evidences) => {
    const items = evidences.map(item => (
      <Evidence
        description={item && item.description}
        fileURI={item && item.fileURI}
        key={name}
        name={name}
      />
    ))

    return items
  }

  render() {
    const { evidences, name } = this.props
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
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired
}

export default EvidenceList
