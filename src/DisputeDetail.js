import React from 'react'
import {giveRuling} from './ethereum/centralizedArbitrator'


class DisputeDetail extends React.Component {

  blockchainDisplay = (payload) => {
    if (payload === undefined || payload.length === 0) {
      return (<p id="no-result">No Result</p>);
    }

    const items = payload.map((x) => <tr key={x.id}>
      <th scope="col">{x.id}</th>
      <th scope="col">
        <a href={"https://ipfs.io/ipfs/" + x.ipfsHash} target="_blank">{x.ipfsHash}</a><br/>{x.hash}</th>
      <th scope="col">{x.tags}</th>
      <th scope="col">{new Date(Number(x.timestamp + "000")).toUTCString()}</th>
    </tr>);
    return (<table key="blockchainDisplay" className="table">
      <thead>
        <tr>
          <th scope="col">Record ID</th>
          <th scope="col">IPFS Hash (Base58 / Decoded)</th>
          <th scope="col">Tags</th>
          <th scope="col">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {items}
      </tbody>
    </table>)
  }

  render() {
    return (
      <div>
        <h4>{"Category: " + this.props.category}</h4>
        <h4>{"File URI: " + this.props.fileURI}</h4>
        <h4>{"File Hash: " + this.props.fileHash}</h4>
        <h4>{"Title: " + this.props.title}</h4>
        <h4>{"Description: " + this.props.description}</h4>
        <h4>{"Question: " + this.props.question}</h4>
        {this.props.aliases && Object.keys(this.props.aliases).map((address) =>
          <h4>{this.props.aliases[address] + ": "} <a href={"https://kovan.etherscan.io/address/" + address} target="_blank" rel="noopener noreferrer">{address}</a></h4>)}

        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Rule
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault();giveRuling(this.props.id, 1)}}>{this.props.rulingOptions && this.props.rulingOptions.titles[0] + ": " + this.props.rulingOptions.descriptions[0]}</a>
            <a className="dropdown-item" href="#" onClick={(e) => {e.preventDefault();giveRuling(this.props.id, 2)}}>{this.props.rulingOptions && this.props.rulingOptions.titles[1] + ": " + this.props.rulingOptions.descriptions[1]}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default DisputeDetail
