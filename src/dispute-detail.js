import Archon from '@kleros/archon'
import EvidenceList from './evidence-list'
import Identicon from './identicon.js'
import PropTypes from 'prop-types'
import React from 'react'
import { giveRuling } from './ethereum/centralized-arbitrator'
import web3 from './ethereum/web3'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    console.log('DISPUTE DETAIL PROPS')
    console.log(props)
    this.archon = new Archon(window.web3.currentProvider)
    console.log(this.archon)
    this.state = {
      validationResult: ''
    }
  }

  handleGiveRulingButtonClick = (account, instance, id, ruling) => e => {
    giveRuling(account, instance, id, ruling) /* Why don't we await? */
  }

  validate(fileURI, evidenceHash) {
    this.setState({ validationResult: 'sdasdasdasd' })
    console.log('validate')
    console.log(this.archon)
    console.log(fileURI)
    this.archon.utils
      .validateFileFromURI(fileURI, { hash: evidenceHash })
      .then(data => {
        console.log(data.isValid) // true
        return data.isValid
      })
      .catch(err => {
        this.setState({ validationResult: 'something bad happened' })
        console.error(err)
      })
  }

  componentDidMount() {
    const { fileHash, fileURI } = this.state
    if (fileURI && fileHash) this.validate(fileURI, fileHash).then()
  }

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
      question,
      rulingOptions,
      title
    } = this.props

    const { validationResult } = this.state

    console.log(this.state)
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h3 className="float-left">
              <b>{`Title: ${title}`}</b>
            </h3>
          </div>
          <div className="col">
            <h3 className="float-right">
              <b>{`Category: ${category}`}</b>
            </h3>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <h4 className="">{description}</h4>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <h4 className="">
              <a href={fileURI} rel="noopener noreferrer" target="_blank">
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
        (
        {fileURI && fileHash && (
          <div className="row">
            <div className="col">
              <sub>{validationResult}</sub>
            </div>
          </div>
        )}
        )
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
                    1
                  )}
                >
                  {rulingOptions &&
                    `${rulingOptions.titles[0]}: ${
                      rulingOptions.descriptions[0]
                    }`}
                </button>
                <button
                  className="dropdown-item"
                  onClick={this.handleGiveRulingButtonClick(
                    activeWallet,
                    centralizedArbitratorInstance,
                    id,
                    2
                  )}
                >
                  {rulingOptions &&
                    `${rulingOptions.titles[1]}: ${
                      rulingOptions.descriptions[1]
                    }`}
                </button>
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
  question: PropTypes.string.isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
}

export default DisputeDetail
