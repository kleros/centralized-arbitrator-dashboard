import web3 from './ethereum/web3'

import React from 'react';
import DisputeDetail from './DisputeDetail'

class Dispute extends React.Component {

constructor(props){
  super(props)
  console.log(props)
}

disputeStatusToString = (code) => {
  switch (code) {
    case "0":
      return "Waiting"
      break;
    case "1":
      return "Appealable"
      break;
    case "2":
      return "Solved"
      break;

    default:
      return ""+code
  }

}

  render(){
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.arbitrable.substring(0, 12) + "..."}</td>
        <td>{this.props.choices}</td>
        <td>{web3.utils.fromWei(this.props.fee, 'ether')}</td>
        <td>{this.props.ruling}</td>
        <td>{this.disputeStatusToString(this.props.status)}</td>
      </tr>
    )
  }
}

export default Dispute
