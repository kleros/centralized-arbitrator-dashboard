import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import React from 'react'
import DisputeDetail from './dispute-detail'
import web3 from './ethereum/web3'

class Dispute extends React.Component {
  constructor(props) {
    super(props)
    console.log("DISPUTE PROPS")
    console.log(props )
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
        return `${code}`
    }
  }

  apiPrefix = networkType => {
    switch (networkType) {
      case 'main':
      return ''
      case 'kovan':
      return 'kovan.'
        break;
      default:
      return  ''

    }
  }

  render() {
    const { centralizedArbitratorInstance, id, arbitrated, fee, status, metaevidence, evidences } = this.props
    return (
      <React.Fragment className="dispute">
        <tbody>
          <tr
            aria-controls={`accordion${id}`}
            aria-expanded="false"
            className="clickable"
            data-target={`#accordion${id}`}
            data-toggle="collapse"
          >
            <td>{id}</td>
            <td>
              <a
                href={`https://${this.apiPrefix(this.props.networkType)}etherscan.io/address/${arbitrated}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {`${arbitrated.substring(0, 8)}...`}
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
              <div className="collapse" id={`accordion${id}`}>
                <DisputeDetail
                  centralizedArbitratorInstance={centralizedArbitratorInstance}
                  id={id}
                  aliases={metaevidence.aliases}
                  category={metaevidence.category}
                  description={metaevidence.description}
                  description={metaevidence.description}
                  evidences={evidences}
                  evidences={evidences}
                  fileHash={metaevidence.fileHash}
                  question={metaevidence.question}
                  rulingOptions={metaevidence.rulingOptions}
                  title={metaevidence.title}
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
