import EvidenceDetail from './evidence-detail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import Mime from 'mime-types'

class Evidence extends React.Component {
  typeToIcon = type => {
    console.log('typetoicon')
    console.log(type)
    switch (type) {
      case 'video':
        return 'video.svg'
      case 'image':
        return 'image.svg'
      default:
        return 'text.svg'
    }
  }

  render() {
    const {
      description,
      fileTypeExtension,
      fileURI,
      fileValid,
      id,
      ipfsGateway,
      name,
      selfHash
    } = this.props

    return (
      <a href={ipfsGateway + fileURI} rel="noopener noreferrer" target="_blank">
        {' '}
        <img
          className="m-1"
          alt=""
          src={this.typeToIcon(
            Mime.lookup(fileURI.split('.')[1])
              .toString()
              .split('/')[0]
          )}
        />
      </a>
    )
  }
}

Evidence.propTypes = {
  description: PropTypes.string.isRequired,
  fileTypeExtension: PropTypes.string.isRequired,
  fileURI: PropTypes.string.isRequired,
  fileValid: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selfHash: PropTypes.string.isRequired
}

export default Evidence
