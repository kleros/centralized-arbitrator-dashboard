import React from 'react'
import PropTypes from 'prop-types'

import Evidence from './evidence'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
    console.warn('EvidenceList constructor')
    console.log(props)
  }

  evidences = (name, evidences) => {
    const items = evidences.map(item => (
      <Evidence
        key={name}
        name={name}
        description={item.description}
        fileURI={item.fileURI}
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
