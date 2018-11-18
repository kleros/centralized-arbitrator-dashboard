import React from 'react'

import Evidence from './evidence'

class EvidenceList extends React.Component {
  constructor(props) {
    super(props)
    console.warn('EvidenceList constructor')
    console.log(props)
  }

  evidences = () => {
    console.warn('EVIDENCES')
    console.log(this.props)
    if (!this.props.evidences) return <Evidence name="loading" />
    else {
      const items = this.props.evidences.map(item => (
        <Evidence
          key={item.name}
          name={item.name}
          description={item.description}
          fileURI={item.fileURI}
        />
      ))

      return items
    }
  }

  render() {
    if (!this.props.evidences)
      return <h1>No Evidence From {this.props.name}</h1>

    return (
      <div>
        <h1>Evidences From {this.props.name}</h1>

        <table className="table table-hover evidence-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>File URI</th>
            </tr>
          </thead>
          {this.evidences()}
        </table>
      </div>
    )
  }
}

export default EvidenceList
