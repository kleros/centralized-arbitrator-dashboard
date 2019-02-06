import Evidence from './evidence'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
    console.log('EVIDENCELISTPROPS')
    console.log(props)
  }
  evidences = (evidences, ipfsGateway) => {
    const items = evidences.map(item => (
      <Evidence
        archon={this.props.archon}
        description={item && item.description}
        fileURI={item && item.fileURI}
        fileHash={item && item.fileHash}
        ipfsGateway={ipfsGateway}
        key={item.name + item.fileURI}
        name={item.name}
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
              <th>Evidence</th>
              <th>Integrity</th>
              <th>
                <FontAwesomeIcon icon="gavel" />
              </th>
            </tr>
          </thead>
          {this.evidences(evidences, ipfsGateway)}
        </table>
      </div>
    )
  }
}

EvidenceList.propTypes = {
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default EvidenceList
