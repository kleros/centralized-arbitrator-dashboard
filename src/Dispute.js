import web3 from './ethereum/web3'

import React from 'react';
import DisputeDetail from './DisputeDetail'

class Dispute extends React.Component {

  constructor(props){
    super(props)
    console.warn("Dispute constructor")
    console.log(props)
  }

  disputeStatusToString = (code) => {
    switch (code) {
      case "0":
        return "Waiting"
      case "1":
        return "Appealable"
      case "2":
        return "Solved"

      default:
        return "" + code
    }

  }

  render(){
    return (
          <React.Fragment>
            <tbody>
              <tr className="clickable" data-toggle="collapse" data-target={'#accordion' + this.props.id}  aria-expanded="false" aria-controls={'accordion' + this.props.id}>
                  <td>{this.props.id}</td>
                  <td><a href={"https://kovan.etherscan.io/address/" + this.props.arbitrated} target="_blank" rel="noopener noreferrer">{this.props.arbitrated.substring(0, 8) + '...'}</a></td>
                  <td>{parseFloat(web3.utils.fromWei(this.props.fee, 'ether')).toExponential()}</td>
                  <td><b>{this.disputeStatusToString(this.props.status)}</b></td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                  <td colSpan="4">
                      <div id={'accordion' + this.props.id} className="collapse">
                      <DisputeDetail key = {this.props.id}
                                      id = {this.props.id}
                                      aliases = {this.props.metaevidence.aliases}
                                      fileURI = {this.props.metaevidence.fileURI}
                                      fileHash = {this.props.metaevidence.fileHash}
                                      category = {this.props.metaevidence.category}
                                      title = {this.props.metaevidence.title}
                                      description = {this.props.metaevidence.description}
                                      question = {this.props.metaevidence.question}
                                      rulingOptions = {this.props.metaevidence.rulingOptions}
                                      evidences = {this.props.evidences}/>
                      </div>
                  </td>
              </tr>
            </tbody>
          </React.Fragment>
    )
  }
}

export default Dispute
