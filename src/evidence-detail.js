import React from 'react'

class EvidenceDetail extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h5>{'Description: ' + this.props.description}</h5>
        <h5>{'Extension: ' + this.props.fileTypeExtension}</h5>
        <h5>{'Self Hash: ' + this.props.selfHash}</h5>
      </div>
    )
  }
}

export default EvidenceDetail
