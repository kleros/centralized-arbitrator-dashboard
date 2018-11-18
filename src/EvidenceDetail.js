import React from 'react'


class EvidenceDetail extends React.Component {
  constructor(props){
    super(props)
  }


  render() {
    return (
      <div>
          <span>{this.props.name}</span>
      </div>
    )
  }
}

export default EvidenceDetail
