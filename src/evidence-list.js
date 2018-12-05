import Evidence from './evidence'
import PropTypes from 'prop-types'
import React from 'react'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
    console.log('EVIDENCELISTPROPS')
    console.log(props)
  }
  evidences = (name, evidences, ipfsGateway) => {
    const items = evidences.map(item => (
      <Evidence
        description={item && item.description}
        fileURI={item && item.fileURI}
        ipfsGateway={ipfsGateway}
        key={name + item.fileURI}
        name={name}
      />
    ))

    return items
  }

  render() {
    const { evidences, ipfsGateway, name } = this.props
    if (!evidences) return <h4>No Evidence From {name}</h4>

    return (
      <div>
        <table className="table table-hover evidence-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>File URI</th>
              <th>Integrity</th>
            </tr>
          </thead>
          {this.evidences(name, evidences, ipfsGateway)}
        </table>
      </div>
    )
  }
}

EvidenceList.propTypes = {
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default EvidenceList
