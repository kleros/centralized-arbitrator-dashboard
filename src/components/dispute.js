import DisputeDetail from './dispute-detail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Archon from "@kleros/archon";
import PropTypes from 'prop-types'
import React from 'react'
import web3 from "../ethereum/web3";
import { getReadOnlyRpcUrl } from '../ethereum/web3'

class Dispute extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      reload: false
    }
  }

  disputeStatusElement = code => {
    switch (code) {
      case '0':
        return (
          <td className="orange-inverted">
            <b>Vote Pending</b>
          </td>
        )
      case '1':
        return (
          <td className="red-inverted">
            <b>Active</b>
          </td>
        )
      case '2':
        return (
          <td className="primary-inverted">
            <b>Closed</b>
          </td>
        )
      default:
        return (
          <td className="red-inverted">
            <b>Undefined</b>
          </td>
        )
    }
  }

  apiPrefix = networkType => {
    switch (networkType) {
      case "mainnet":
        return " ";
      case "kovan":
        return "kovan.";
      case "ropsten":
        return "ropsten.";
      case "goerli":
        return "goerli.";
      case "rinkeby":
        return "rinkeby.";
      default:
        return " ";
    }
  }

  render() {
    const {
      activeWallet,
      appealPeriodEnd,
      appealPeriodStart,
      arbitrated,
      archon,
      autoAppealableArbitratorInstance,
      evidences,
      fee,
      id,
      ipfsGateway,
      metaevidenceObject,
      networkType,
      ruling,
      status
    } = this.props
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
            <td>{id}</td>
            <td>
              {metaevidenceObject && metaevidenceObject.metaEvidenceJSON.title}
            </td>
            <td>
              <a
                href={`https://${this.apiPrefix(
                  networkType
                )}etherscan.io/address/${arbitrated}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {`${arbitrated.substring(0, 8)}...`}
              </a>
            </td>
            <td>{web3.utils.fromWei(fee, 'ether')}</td>
            {this.disputeStatusElement(status)}
            <td>
              <FontAwesomeIcon icon="caret-down" />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="6">
              <div className="collapse mb-5" id={`accordion${id}`}>
                <DisputeDetail
                  activeWallet={activeWallet}
                  aliases={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.aliases
                  }
                  appealPeriodEnd={appealPeriodEnd}
                  appealPeriodStart={appealPeriodStart}
                  arbitrableContractAddress={arbitrated}
                  archon={archon}
                  category={
                    Number(metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.category)
                  }
                  centralizedArbitratorInstance={
                    autoAppealableArbitratorInstance
                  }
                  description={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.description
                  }
                  evidenceDisplayInterfaceURI={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON
                      .evidenceDisplayInterfaceURI
                  }
                  evidences={evidences}
                  fileURI={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.fileURI
                  }
                  fileValid={metaevidenceObject && metaevidenceObject.fileValid}
                  id={Number(id)}
                  interfaceValid={
                    metaevidenceObject && metaevidenceObject.interfaceValid
                  }
                  ipfsGateway={ipfsGateway}
                  metaEvidenceJSONValid={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSONValid
                  }
                  question={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.question
                  }
                  ruling={ruling}
                  rulingOptions={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.rulingOptions
                  }
                  status={status}
                  title={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON.title
                  }
                  version={
                    metaevidenceObject &&
                    metaevidenceObject.metaEvidenceJSON._v || "0"
                  }
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
  activeWallet: PropTypes.string.isRequired,
  appealPeriodEnd: PropTypes.number.isRequired,
  appealPeriodStart: PropTypes.number.isRequired,
  arbitrated: PropTypes.string.isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  autoAppealableArbitratorInstance: PropTypes.instanceOf(web3.eth.Contract)
    .isRequired,
  evidences: PropTypes.arrayOf(PropTypes.object).isRequired,
  fee: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  metaevidenceObject: PropTypes.shape({
    aliases: PropTypes.shape({
      [PropTypes.string]: PropTypes.string
    }),
    category: PropTypes.string,
    description: PropTypes.string,
    fileHash: PropTypes.string,
    fileTypeExtension: PropTypes.string,
    fileURI: PropTypes.string,
    rulingOptions: PropTypes.shape({
      description: PropTypes.arrayOf(PropTypes.string).isRequired,
      titles: PropTypes.arrayOf(PropTypes.string).isRequired
    }),
    selfHash: PropTypes.string,
    title: PropTypes.string
  }).isRequired,
  networkType: PropTypes.string.isRequired,
  ruling: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default Dispute
