import Archon from '@kleros/archon'
import EvidenceList from './evidence-list'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'
import { giveRuling } from '../ethereum/centralized-arbitrator'
import web3 from '../ethereum/web3'
import _ from 'lodash'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    console.log('DISPUTE DETAIL PROPS')
    console.log(props)
    this.archon = new Archon(window.web3.currentProvider)
    console.log(this.archon)
    this.state = {
      validationResult: 'Integrity not tested.'
    }
  }

  handleGiveRulingButtonClick = (account, instance, id, ruling) => () => {
    console.log(ruling)
    giveRuling(account, instance, id, ruling) /* Why don't we await? */
  }

  validate(fileURI, fileHash) {
    this.setState({ validationResult: 'Testing integrity...' })
    console.log('validate')
    console.log(this.archon)
    console.log(fileURI)
    this.archon.utils
      .validateFileFromURI(fileURI, { hash: fileHash, preValidated: true })
      .then(data => {
        console.log('data')
        console.log(data) // true
        if (data.isValid)
          this.setState({ validationResult: 'Integrity is intact!' })
        else this.setState({ validationResult: 'Integrity is broken!' })
      })
      .catch(err => {
        this.setState({ validationResult: 'Integrity test failed.' })
        console.log('here')
        console.error(err)
      })
  }

  renderedRulingOptions = (
    options,
    activeWallet,
    centralizedArbitratorInstance,
    id
  ) =>
    _.zip(options.titles, options.descriptions).map((option, key) => {
      return (
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
      )
    })

  render() {
    console.log('PRERENDER DISPUTEDETAIL')
    console.log(this.props)
    const {
      activeWallet,
      aliases,
      category,
      centralizedArbitratorInstance,
      description,
      evidences,
      fileHash,
      fileURI,
      id,
      ipfsGateway,
      question,
      rulingOptions,
      title
    } = this.props

    const { validationResult } = this.state

    if (fileURI && validationResult === 'Integrity not tested.')
      this.validate(ipfsGateway + fileURI, fileURI.split('/')[2])

    console.log(this.state)
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h3 className="float-left">
              <b>{`${title}`}</b>
            </h3>
          </div>
          <div className="col">
            <h3 className="float-right">
              <b>{`${category}`}</b>
            </h3>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col text-left">
            <h4 className="">{description}</h4>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <h4 className="">
              <a
                href={ipfsGateway + fileURI}
                rel="noopener noreferrer"
                target="_blank"
              >
                Agreement File
              </a>
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <sub>{fileHash}</sub>
          </div>
        </div>
        {validationResult}
        {fileURI && fileHash && (
          <div className="row">
            <div className="col">
              <sub>{validationResult}</sub>
            </div>
          </div>
        )}

        <hr />
        <br />
        <div className="row">
          {aliases &&
            Object.keys(aliases).map(address => (
              <div className="col" key={address}>
                <Identicon
                  bgColor="#4004A3"
                  className="identicon"
                  color="#009AFF"
                  scale={3}
                  seed={address}
                  size={10}
                  spotColor="white"
                  title={aliases[address]}
                >
                  {address}
                </Identicon>
                <EvidenceList
                  evidences={evidences[address]}
                  ipfsGateway={ipfsGateway}
                  name={aliases[address]}
                />
              </div>
            ))}
        </div>
        <hr />
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
  category: PropTypes.number.isRequired,
  centralizedArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  description: PropTypes.string.isRequired,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileHash: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
}

export default DisputeDetail
