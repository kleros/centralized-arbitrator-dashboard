import React from 'react'
import PropTypes from 'prop-types'

import { giveRuling } from './ethereum/centralized-arbitrator'
import EvidenceList from './evidence-list'
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
      <div className="container">
        <div className="row">
          <div className="col">
            <h3 className="float-left">
              <b>{'Title: ' + title}</b>
            </h3>
          </div>
          <div className="col">
            <h3 className="float-right">
              <b>{'Category: ' + category}</b>
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h4 className="float-left" style={{ marginLeft: 1 + 'em' }}>
              {description}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h4 className="float-left">
              <a href={fileURI} target="_blank" rel="noopener noreferrer">
                Agreement File
              </a>
            </h4>
          </div>
          <div className="col">
            <h4 className="float-right">{'File MultiHash: ' + fileHash}</h4>
          </div>
        </div>
        <hr />
        <div className="row">
          {aliases &&
            Object.keys(aliases).map(address => (
              <div key={address} className="col">
                <Identicon
                  title={aliases[address]}
                  seed={address}
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
            ))}
        </div>
        <div className="row">
          <div className="col">
            <h4 className="">{'Question: ' + question}</h4>
          </div>
        </div>
        <div className="row">
          <div className="col">
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
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="dropdown-item"
                  onClick={this.handleGiveRulingButtonClick(id, 1)}
                >
                  {rulingOptions &&
                    rulingOptions.titles[0] +
                      ': ' +
                      rulingOptions.descriptions[0]}
                </button>
                <button
                  className="dropdown-item"
                  onClick={this.handleGiveRulingButtonClick(id, 2)}
                >
                  {rulingOptions &&
                    rulingOptions.titles[1] +
                      ': ' +
                      rulingOptions.descriptions[1]}
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
