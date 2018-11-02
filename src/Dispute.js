import web3 from './ethereum/web3'

import React from 'react';
import DisputeDetail from './DisputeDetail'

class Dispute extends React.Component {

  constructor(props){
    super(props)
    console.warn("here")
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


  parsedMetaEvidence = () => {
    console.log("url " + this.props.metaevidence)
    fetch(this.props.metaevidence)
      .then(function(response) {
        console.log(response)
        console.log(response.json())
        return response.json()
      })
      .then(function(myJson) {
        console.log(myJson);
      });
  }


  render(){
    return (
          <React.Fragment>
            <tbody>
              <tr className="clickable" data-toggle="collapse" data-target={'#accordion' + this.props.id}  aria-expanded="false" aria-controls={'accordion' + this.props.id}>
                  <td>{this.props.id}</td>
                  <td>{this.props.arbitrated.substring(0, 12) + '...'}</td>
                  <td>{web3.utils.fromWei(this.props.fee, 'ether')}</td>
                  <td>{this.props.ruling}</td>
                  <td>{this.disputeStatusToString(this.props.status)}</td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                  <td colSpan="5">
                      <div id={'accordion' + this.props.id} className="collapse">
                        <DisputeDetail fileURI="" fileHash="" category="" title="" description="" question="" rulingOptions="" metaevidence={this.parsedMetaEvidence()} />
                      </div>
                  </td>
              </tr>
            </tbody>
          </React.Fragment>
    )
  }
}

export default Dispute
