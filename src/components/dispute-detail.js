import Archon from '@kleros/archon'
import EvidenceList from './evidence-list'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import { giveRuling } from '../ethereum/centralized-arbitrator'
import web3 from '../ethereum/web3'

class DisputeDetail extends React.Component {
  handleGiveRulingButtonClick = (account, instance, id, ruling) => () => {
    console.log(ruling)
    giveRuling(account, instance, id, ruling) /* Why don't we await? */
  }

  renderedRulingOptions = (
    options,
    activeWallet,
    centralizedArbitratorInstance,
    id
  ) =>
    _.zip(options.titles, options.descriptions).map((option, key) => (
      <button
        className="dropdown-item"
        key={key + 1}
        onClick={this.handleGiveRulingButtonClick(
          activeWallet,
          centralizedArbitratorInstance,
          id,
          key + 1
        )}
      >
        {option[0]}: {option[1]}
      </button>
    ))

  render() {
    console.log('PRERENDER DISPUTEDETAIL')
    console.log(this.props)
    const {
      activeWallet,
      aliases,
      archon,
      category,
      centralizedArbitratorInstance,
      description,
      evidences,
      fileURI,
      fileHash,
      fileValid,
      id,
      ipfsGateway,
      question,
      rulingOptions,
      title
    } = this.props

    console.log(this.state)
    return (
      <div className="container">
        <div className="row p-0">
          <div className="col p-0">
            <h3 className="float-left">
              <b>{`${title}`}</b>
            </h3>
          </div>
          <div className="col p-0">
            <h3 className="float-right">
              <b>{`${category}`}</b>
            </h3>
          </div>
        </div>
        <br />
        <div className="row p-0">
          <div className="col p-0 text-left">
            <h4 className="">{description}</h4>
          </div>
        </div>
        <br />
        <div className="row border p-4">
          <div className="col-md-1">
            <a
              href={ipfsGateway + fileURI}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img alt="" src="text.svg" />
            </a>
          </div>
          <div className="col text-left">
            <div className="row">
              <div className="col secondary-inverted">
                <h6>File URI: {fileURI}</h6>
              </div>
            </div>
            <div className="row">
              <div className="col secondary-inverted">
                <h6>File Hash: {fileURI && fileURI.split('/')[2]}</h6>
              </div>
            </div>
          </div>
        </div>

        <br />
        {aliases && (
          <div className="row">
            <div className="col-md-6 p-0" key={Object.keys(aliases)[0]}>
              <div className="col-md-11 border">
                <EvidenceList
                  address={Object.keys(aliases)[0]}
                  aliases={aliases}
                  archon={archon}
                  evidences={evidences[Object.keys(aliases)[0]]}
                  ipfsGateway={ipfsGateway}
                  name={aliases[Object.keys(aliases)[0]]}
                />
              </div>
            </div>

            <div className="col-md-6 p-0" key={Object.keys(aliases)[1]}>
              <div className="offset-md-1 col-md-11 border">
                <EvidenceList
                  address={Object.keys(aliases)[1]}
                  aliases={aliases}
                  archon={archon}
                  evidences={evidences[Object.keys(aliases)[1]]}
                  ipfsGateway={ipfsGateway}
                  name={aliases[Object.keys(aliases)[1]]}
                />
              </div>
            </div>
          </div>
        )}
        <br />
        <div className="row">
          <div className="col">
            <h4 className="">{question}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="dropdown">
              <button
                aria-expanded="false"
                aria-haspopup="true"
                className="btn btn-secondary dropdown-toggle primary"
                data-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                Give Ruling
              </button>
              <div
                aria-labelledby="dropdownMenuButton"
                className="dropdown-menu"
              >
                <button
                  className="dropdown-item"
                  onClick={this.handleGiveRulingButtonClick(
                    activeWallet,
                    centralizedArbitratorInstance,
                    id,
                    0
                  )}
                >
                  {rulingOptions && `Abstain: Refuse to Rule`}
                </button>
                {rulingOptions &&
                  this.renderedRulingOptions(
                    rulingOptions,
                    activeWallet,
                    centralizedArbitratorInstance,
                    id
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DisputeDetail.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  category: PropTypes.number.isRequired,
  centralizedArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  description: PropTypes.string.isRequired,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileURI: PropTypes.string.isRequired,
  fileValid: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
}

export default DisputeDetail
