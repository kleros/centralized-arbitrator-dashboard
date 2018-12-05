import Archon from '@kleros/archon'
import EvidenceDetail from './evidence-detail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'

class Evidence extends React.Component {
  constructor(props) {
    super(props)
    this.archon = new Archon(window.web3.currentProvider)
    this.state = {
      validationResult: 'Untested'
    }
  }

  validate(fileURI, fileHash) {
    this.setState({ validationResult: 'Testing' })
    console.log('validate')
    console.log(this.archon)
    console.log(fileURI)
    console.log(fileHash)
    this.archon.utils
      .validateFileFromURI(fileURI, { hash: fileHash })
      .then(data => {
        console.log('data-evidence')
        console.log(data) // true
        if (data.isValid) this.setState({ validationResult: 'OK' })
        else this.setState({ validationResult: 'Broken' })
      })
      .catch(err => {
        this.setState({ validationResult: err })
        console.log('here')
        console.error(err)
      })
  }

  render() {
    const {
      description,
      fileTypeExtension,
      fileURI,
      id,
      ipfsGateway,
      name,
      selfHash
    } = this.props

    const { validationResult } = this.state

    if (fileURI && validationResult === 'Untested')
      this.validate(ipfsGateway + fileURI, fileURI.split('/')[2])

    return (
      <React.Fragment>
        <tbody>
          <tr
            aria-controls={`accordion${id}`}
            aria-expanded="false"
            className="clickable"
            data-target={`#accordion${id}`}
            data-toggle="collapse"
          >
            <td>
              <a
                href={ipfsGateway + fileURI}
                rel="noopener noreferrer"
                target="_blank"
              >
                {name}
              </a>
            </td>
            <td>{validationResult}</td>
            <td>
              <FontAwesomeIcon icon="caret-down" />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="5">
              <div className="collapse" id={`accordion${id}`}>
                <EvidenceDetail
                  description={description}
                  fileTypeExtension={fileTypeExtension}
                  selfHash={selfHash}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    )
  }
}

Evidence.propTypes = {
  description: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default Evidence
