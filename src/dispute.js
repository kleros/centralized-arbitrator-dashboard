import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import web3 from './ethereum/web3'
import DisputeDetail from './dispute-detail'

class Dispute extends React.Component {
  constructor(props) {
    super(props)
    console.warn('Dispute constructor')
    console.log(props)
  }

  disputeStatusToString = code => {
    switch (code) {
      case '0':
        return 'Waiting'
      case '1':
        return 'Appealable'
      case '2':
        return 'Solved'

      default:
        return '' + code
    }
  }

  render() {
    const { id, arbitrated, fee, status, metaevidence, evidences } = this.props
    return (
      <React.Fragment className="dispute">
        <tbody>
          <tr
            className="clickable"
            data-toggle="collapse"
            data-target={'#accordion' + id}
            aria-expanded="false"
            aria-controls={'accordion' + id}
          >
            <td>{id}</td>
            <td>
              <a
                href={'https://kovan.etherscan.io/address/' + arbitrated}
                target="_blank"
                rel="noopener noreferrer"
              >
                {arbitrated.substring(0, 8) + '...'}
              </a>
            </td>
            <td>
              {parseFloat(web3.utils.fromWei(fee, 'ether')).toExponential()}
            </td>
            <td className="primary-inverted">
              <b>{this.disputeStatusToString(status)}</b>
            </td>
            <td>
              <FontAwesomeIcon icon="caret-down" />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="5">
              <div id={'accordion' + id} className="collapse">
                <DisputeDetail
                  key={id}
                  id={id}
                  aliases={metaevidence.aliases}
                  fileURI={metaevidence.fileURI}
                  fileHash={metaevidence.fileHash}
                  category={metaevidence.category}
                  title={metaevidence.title}
                  description={metaevidence.description}
                  question={metaevidence.question}
                  rulingOptions={metaevidence.rulingOptions}
                  evidences={evidences}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </React.Fragment>
    )
  }
}

Dispute.propTypes = {
  id: PropTypes.number.isRequired,
  arbitrated: PropTypes.string.isRequired,
  fee: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  metaevidence: PropTypes.shape({
    fileURI: PropTypes.string,
    fileHash: PropTypes.string,
    fileTypeExtension: PropTypes.string,
    category: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    aliases: PropTypes.shape({
      [PropTypes.string]: PropTypes.string
    }),
    rulingOptions: PropTypes.shape({
      titles: PropTypes.arrayOf(PropTypes.string).isRequired,
      description: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    selfHash: PropTypes.string
  }).isRequired,
  evidences: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Dispute
