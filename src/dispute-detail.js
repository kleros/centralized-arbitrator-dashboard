import PropTypes from 'prop-types'
import React from 'react'
import { giveRuling } from './ethereum/centralized-arbitrator'
import EvidenceList from './evidence-list'
import Identicon from './identicon.js'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    console.log("DISPUTE DETAIL PROPS")
    console.log(props)
  }

  handleGiveRulingButtonClick = (account, instance, id, ruling) => () => {
    giveRuling(account, instance, id, ruling) /*Why don't we await?*/
  }

  render() {
    const {
      centralizedArbitratorInstance,
      id,
      title,
      category,
      description,
      fileURI,
      fileHash,
      question,
      aliases,
      rulingOptions,
      evidences
    } = this.props

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
                  onClick={this.handleGiveRulingButtonClick(this.props.activeWallet, centralizedArbitratorInstance, id, 1)}
                >
                  {rulingOptions &&
                    `${rulingOptions.titles[0]}: ${
                      rulingOptions.descriptions[0]
                    }`}
                </button>
                <button
                  className="dropdown-item"
                  onClick={this.handleGiveRulingButtonClick(this.props.activeWallet, centralizedArbitratorInstance, id, 2)}
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
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  category: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  fileHash: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default DisputeDetail
