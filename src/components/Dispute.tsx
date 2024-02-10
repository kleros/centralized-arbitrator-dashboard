import DisputeDetail from "./DisputeDetail"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Archon from "@kleros/archon"
import { FC, useEffect, useState } from "react"
import web3 from "../ethereum/web3"
import { Contract } from "ethers"
import {
  MetaevidenceObject,
  ReturnEvidence,
  ReturnMetaevidence,
} from "../types"
//import { arbitrableInstanceAt } from "../ethereum/arbitrable"
import { getReadOnlyRpcUrl } from "../ethereum/web3"
import { EvidenceType } from "../types"
import { arbitrableInstanceAt } from "../ethereum/arbitrable"
//import { cloneDeep } from "lodash"

const Dispute: FC<{
  contractAddress: string
  activeWallet: string
  appealPeriodEnd: number
  appealPeriodStart: number
  arbitrated: string
  archon: typeof Archon
  autoAppealableArbitratorInstance: Contract
  evidenceArray: EvidenceType[]
  fees: string
  id: number
  ipfsGateway: string
  metaevidenceObject: MetaevidenceObject
  networkType: string
  ruling: number
  status: string
}> = (p) => {
  const subscriptions = []

  useEffect(() => {
    let cancel = false
    if (cancel) return
    fetchEvidences()
    fetchMetaevidence()
    listenToNewEvidences()
    return () => {
      cancel = true
    }
  }, [])

  const [evidenceArrayState, setEvidenceArrayState] = useState<EvidenceType[]>(
    p.evidenceArray
  )
  const [metaevidenceState, setMetaevidenceState] =
    useState<MetaevidenceObject>(p.metaevidenceObject)

  const fetchEvidences = () => {
    p.archon.arbitrable
      .getDispute(p.arbitrated.toLowerCase(), p.contractAddress, p.id, {
        fromBlock: 0,
      })
      .then((event: ReturnEvidence) => {
        return p.archon.arbitrable
          .getEvidence(
            p.arbitrated.toLowerCase(),
            p.contractAddress,
            event.evidenceGroupID
          )
          .then((evidences: EvidenceType[]) => {
            setEvidenceArrayState(evidences)
          })
          .catch((err: Error) => {
            console.log("error getting evidences", { id: p.id, error: err })
          })
      })
      .catch((err: Error) => {
        console.log("error getting disputes", { id: p.id, error: err })
      })
  }

  const fetchMetaevidence = async () => {
    const currentChainID = (await web3.eth.getChainId()).toString()
    p.archon.arbitrable
      .getDispute(p.arbitrated.toLowerCase(), p.contractAddress, p.id, {
        fromBlock: 0,
      })
      .then((event: ReturnMetaevidence) => {
        return p.archon.arbitrable
          .getMetaEvidence(p.arbitrated, event.metaEvidenceID, {
            strict: true,
            getJsonRpcUrl: (chainId: number) => getReadOnlyRpcUrl({ chainId }),
            scriptParameters: {
              disputeID: p.id,
              arbitratorChainID: currentChainID,
              arbitratorContractAddress: p.contractAddress,
            },
          })
          .then((x: MetaevidenceObject) => {
            setMetaevidenceState(x)
          })
          .catch((err: Error) => {
            console.log("Error getting metaevidence", err)
          })
      })
      .catch((err: Error) => {
        console.log("Error getting dispute", err)
      })
  }

  const listenToNewEvidences = () => {
    const filter = { _arbitrator: p.contractAddress, _disputeID: p.id }
    subscriptions.push(
      arbitrableInstanceAt(p.arbitrated.toLowerCase())
        .events.Evidence({
          filter,
        })
        .on("data", (event: ReturnEvidence) => {
          p.archon.arbitrable
            .getEvidence(
              p.arbitrated.toLowerCase(),
              p.contractAddress,
              event.returnValues._evidenceGroupID,
              {
                fromBlock: event.blockNumber,
              }
            )
            .then((_evidence: EvidenceType) => fetchEvidences())
        })
    )
  }

  const disputeStatusElement = (code: string) => {
    switch (code) {
      case "0":
        return (
          <td className="orange-inverted">
            <b>Vote Pending</b>
          </td>
        )
      case "1":
        return (
          <td className="red-inverted">
            <b>Active</b>
          </td>
        )
      case "2":
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

  const apiPrefix = (networkType: string) => {
    switch (networkType) {
      case "mainnet":
        return " "
      case "sepolia":
        return "sepolia."
      case "gnosis":
        return "gnosis."
      case "gnosis-chiado":
        return "gnosis chiado."
      default:
        return " "
    }
  }

  const showTitle = () => {
    if (!metaevidenceState.metaEvidenceJSON.title) return "loading..."
    if (metaevidenceState) {
      return metaevidenceState && metaevidenceState.metaEvidenceJSON.title
    }
    return null
  }

  return (
    <>
      <tbody>
        <tr
          aria-controls={`accordion${p.id}`}
          aria-expanded="false"
          className="clickable"
          data-target={`#accordion${p.id}`}
          data-toggle="collapse"
        >
          <td>{p.id}</td>
          <td>{showTitle()}</td>
          <td>
            <a
              href={`https://${apiPrefix(p.networkType)}etherscan.io/address/${
                p.arbitrated
              }`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`${p.arbitrated.substring(0, 8)}...`}
            </a>
          </td>
          <td>{web3.utils.fromWei(p.fees, "ether")}</td>
          {disputeStatusElement(p.status)}
          <td>
            <FontAwesomeIcon icon="caret-down" />
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td colSpan={Number("6")}>
            <div className="collapse mb-5" id={`accordion${p.id}`}>
              <DisputeDetail
                activeWallet={p.activeWallet}
                aliases={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.aliases
                }
                appealPeriodEnd={p.appealPeriodEnd}
                appealPeriodStart={p.appealPeriodStart}
                arbitrableContractAddress={p.arbitrated}
                archon={p.archon}
                category={Number(
                  metaevidenceState &&
                    metaevidenceState.metaEvidenceJSON.category
                )}
                centralizedArbitratorInstance={
                  p.autoAppealableArbitratorInstance
                }
                description={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.description
                }
                evidenceDisplayInterfaceURI={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.evidenceDisplayInterfaceURI
                }
                evidenceArray={evidenceArrayState}
                fileURI={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.fileURI
                }
                fileValid={metaevidenceState && metaevidenceState.fileValid}
                id={Number(p.id)}
                interfaceValid={
                  metaevidenceState && metaevidenceState.interfaceValid
                }
                ipfsGateway={p.ipfsGateway}
                metaEvidenceJSONValid={
                  metaevidenceState && metaevidenceState.metaEvidenceJSONValid
                }
                question={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.question
                }
                ruling={p.ruling}
                rulingOptions={
                  metaevidenceState &&
                  metaevidenceState.metaEvidenceJSON.rulingOptions
                }
                status={p.status}
                title={
                  metaevidenceState && metaevidenceState.metaEvidenceJSON.title
                }
                version={
                  (metaevidenceState &&
                    metaevidenceState.metaEvidenceJSON._v) ||
                  "0"
                }
              />
            </div>
          </td>
        </tr>
      </tbody>
    </>
  )
}

export default Dispute
