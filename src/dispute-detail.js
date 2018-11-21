import React from 'react'
import PropTypes from 'prop-types'

import { giveRuling } from './ethereum/centralized-arbitrator'
import EvidenceList from './evidence-list'
import './dispute-detail.css'
import Identicon from './identicon.js'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    console.warn('DisputeDetail constructor')
    console.log(props)
  }

  cb(id, ruling) {
    console.log('CB')
    giveRuling(id, ruling)
  }

  handleGiveRulingButtonClick = (id, ruling) => () => {
    giveRuling(id, ruling)
  }

  render() {
    const {
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
      <div>
        <div className="modal-body row">
          <div className="col-md-6">
            <h3 className="float-left">
              <b>{'Title: ' + title}</b>
            </h3>
          </div>
          <div className="col-md-6">
            <h3 className="float-right">
              <b>{'Category: ' + category}</b>
            </h3>
          </div>
        </div>

        <h4 className="float-left">{description}</h4>
        <br />
        <h4 className="float-left">
          Agreement File:{' '}
          <a href={fileURI} target="_blank" rel="noopener noreferrer">
            {fileURI && fileURI.substring(0, 38) + '...'}
          </a>
        </h4>
        <h4 className="float-right">{'File MultiHash: ' + fileHash}</h4>
        <br />

        <h4>{'Question: ' + question}</h4>
        <div className="modal-body row">
          {aliases &&
            Object.keys(aliases).map(address => (
              <div key={address}>
                <div className="col-md-6">
                  <Identicon
                    title="Arbitrator"
                    seed={aliases[address]}
                    size={10}
                    scale={3}
                    color="#009AFF"
                    bgColor="#4004A3"
                    spotColor="white"
                    className="identicon"
                  >
                    {address}
                  </Identicon>
                  <EvidenceList
                    name={aliases[address]}
                    evidences={evidences[address]}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="modal-body row">
          {aliases &&
            Object.keys(aliases).map(address => (
              <div key={address} className="col-md-6">
                <EvidenceList
                  name={aliases[address]}
                  evidences={evidences[address]}
                />
              </div>
            ))}
        </div>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Give Ruling
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button
              className="dropdown-item"
              onClick={this.handleGiveRulingButtonClick(id, 1)}
            >
              {rulingOptions &&
                rulingOptions.titles[0] + ': ' + rulingOptions.descriptions[0]}
            </button>
            <button
              className="dropdown-item"
              onClick={this.handleGiveRulingButtonClick(id, 2)}
            >
              {rulingOptions &&
                rulingOptions.titles[1] + ': ' + rulingOptions.descriptions[1]}
            </button>
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
