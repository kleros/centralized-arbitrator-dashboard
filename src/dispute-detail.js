import React from 'react'
import PropTypes from 'prop-types'

import { giveRuling } from './ethereum/centralized-arbitrator'
import EvidenceList from './evidence-list'

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props)
    console.warn('DisputeDetail constructor')
    console.log(props)
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
        <h4>{'Title: ' + title}</h4>
        <h4>{'Category: ' + category}</h4>
        <h4>{'Description: ' + description}</h4>
        <br />
        <h4>
          File URI:{' '}
          <a href={fileURI} target="_blank" rel="noopener noreferrer">
            {fileURI && fileURI.substring(0, 38) + '...'}
          </a>
        </h4>
        <h4>{'File Hash: ' + fileHash}</h4>
        <br />
        <h4>{'Question: ' + question}</h4>
        {aliases &&
          Object.keys(aliases).map(address => (
            <h4 key={address}>
              {aliases[address] + ': '}{' '}
              <a
                href={'https://kovan.etherscan.io/address/' + address}
                target="_blank"
                rel="noopener noreferrer"
              >
                {address}
              </a>
            </h4>
          ))}
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
              onClick={e => {
                e.preventDefault()
                giveRuling(id, 1)
              }}
            >
              {rulingOptions &&
                rulingOptions.titles[0] + ': ' + rulingOptions.descriptions[0]}
            </button>
            <button
              className="dropdown-item"
              onClick={e => {
                e.preventDefault()
                giveRuling(id, 2)
              }}
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
