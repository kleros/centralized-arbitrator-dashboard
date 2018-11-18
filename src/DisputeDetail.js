import React from 'react'
import {giveRuling} from './ethereum/centralizedArbitrator'
import EvidenceList from './EvidenceList'


class DisputeDetail extends React.Component {
  constructor(props)
  {
    super(props)
    console.warn("DisputeDetail constructor")
    console.log(props)
  }

  getFirstAddress = () => {
    if(!this.props.aliases)
      return ""
    console.warn("SUCCESSFULLY LOADED ADDRESS")
    console.log(Object.keys(this.props.aliases)[0])
    console.log(this.props.evidences)
    return  Object.keys(this.props.aliases)[0]
  }


  render() {
    return (
      <div>
        <h4>{this.props.id}</h4>
        <h4>{"Title: " + this.props.title}</h4>
        <h4>{"Category: " + this.props.category}</h4>
        <h4>{"Description: " + this.props.description}</h4>
        <br/>
        <h4>File URI: <a href={this.props.fileURI} target="_blank" rel="noopener noreferrer">{this.props.fileURI && this.props.fileURI.substring(0, 38) + '...'}</a></h4>
        <h4>{"File Hash: " + this.props.fileHash}</h4>
        <br/>
        <h4>{"Question: " + this.props.question}</h4>
        {this.props.aliases && Object.keys(this.props.aliases).map((address) =>
          <h4 key={address}>{this.props.aliases[address] + ": "} <a href={"https://kovan.etherscan.io/address/" + address} target="_blank" rel="noopener noreferrer">{address}</a></h4>)}
          <div className="modal-body row">
          {this.props.aliases && Object.keys(this.props.aliases).map((address) =>
            <div className="col-md-6">
              <EvidenceList name={this.props.aliases[address]} evidences={this.props.evidences[address]}/>
            </div>
          )}
          </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Give Ruling
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
