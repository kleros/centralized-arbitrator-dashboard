import {
  autoAppealableArbitratorInstance,
  getDispute,
  getDisputeStatus,
} from "../ethereum/auto-appealable-arbitrator"
import Archon from "@kleros/archon"
import Dispute from "./Dispute"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useEffect, useState } from "react"
import { arbitrableInstanceAt } from "../ethereum/arbitrable"
import { getReadOnlyRpcUrl } from "../ethereum/web3"
import web3 from "../ethereum/web3"
//import Evidence from "./Evidence"
import { DisputeType, EvidenceType } from "../types"

const DisputeList: FC<{
  activeWallet: string
  archon: typeof Archon
  contractAddress: string
  networkType: string
  notificationCallback: (notification: string, time: number) => void
}> = (p) => {
  const [filter, setFilter] = useState(0)
  const [disputes, setDisputes] = useState<DisputeType[]>([])
  const subscriptions = []
  const gateway = "https://ipfs.kleros.io"

  const disputeStatusToString = (code: number) => {
    switch (code) {
      case 0:
        return "Pending"
      case 1:
        return "Active"
      case 2:
        return "Closed"
      default:
        return "All"
    }
  }

  useEffect(() => {
    const autoAppealableArbitrator =
      autoAppealableArbitratorInstance(p.contractAddress)
    getPastDisputeCreationsAndListenToNewOnes(autoAppealableArbitrator)
  }, [p.contractAddress])

  const getPastDisputeCreationsAndListenToNewOnes = (
    autoAppealableArbitrator: any
  ) => {
    autoAppealableArbitrator
      .getPastEvents("DisputeCreation", { fromBlock: 0 })
      .then((events: any[]) =>
        events.map((event) =>
          addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable,
            false
          )
        )
      )

    subscriptions.push(
      autoAppealableArbitrator.events
        .DisputeCreation()
        .on("data", (event: any) =>
          addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable,
            true
          )
        )
    )
  }

  const fetchAndAssignEvidence = async (
    disputeID: number,
    evidence: EvidenceType
  ) => {
    const targetIndex = disputes.findIndex(
      (d: DisputeType) => d.id === disputeID
    )

    disputes[targetIndex].evidences.push(evidence)
    setDisputes(disputes)

    /*const newEvidences = disputes[targetIndex].evidences.concat(evidence)
    const newDisputeToChange = disputes.map(d => d.evidences === newEvidences ? )
    const newDispute = disputes.map(d => d.evidences === newEvidences ? )
    if (newDispute) {
      const newDisputes = disputes.map(d => d.id === newDispute.id ? newDispute : d)
      setDisputes(newDisputes)
    }*/

    /*disputes[targetIndex].evidences = disputes[targetIndex].evidences || {}
    disputes[targetIndex].evidences[0] =
    disputes[targetIndex].evidences[0] || []

    disputes[targetIndex].evidences[0].push(evidence)*/
  }

  const fetchAndAssignMetaevidence = async (
    disputeID: number,
    evidence: EvidenceType
  ) => {
    const targetIndex = disputes.findIndex(
      (d: DisputeType) => d.id === disputeID
    )

    disputes[targetIndex].metaevidenceObject = evidence

    setDisputes(disputes)
  }

  //const assignMetaEvidenceUsingArchon = () => {}

  const addDispute = async (
    disputeID: number,
    arbitrableAddress: string,
    isNew: boolean
  ) => {
    const dispute = await getDispute(
      autoAppealableArbitratorInstance(p.contractAddress),
      disputeID
    )

    const date = new Date()

    if (isNew)
      p.notificationCallback(
        `New dispute #${disputeID} in contract ${p.contractAddress.substring(
          0,
          8
        )}...`,
        date.getTime()
      )

    dispute.id = disputeID
    dispute.evidences = {}
    dispute.statusERC792 = await getDisputeStatus(
      autoAppealableArbitratorInstance(p.contractAddress),
      disputeID
    )

    setDisputes([...disputes, dispute])

    const filter = { _arbitrator: p.contractAddress, _disputeID: disputeID }

    const currentChainID = (await web3.eth.getChainId()).toString()
    p.archon.arbitrable
      .getDispute(arbitrableAddress, p.contractAddress, disputeID, {
        fromBlock: 0,
      })
      .then((event: typeof Archon) => {
        return p.archon.arbitrable
          .getMetaEvidence(arbitrableAddress, event.metaEvidenceID, {
            strict: true,
            getJsonRpcUrl: (chainId: number) => getReadOnlyRpcUrl({ chainId }),
            scriptParameters: {
              disputeID: disputeID,
              arbitratorChainID: currentChainID,
              arbitratorContractAddress: p.contractAddress,
            },
          })
          .then((x: EvidenceType) => {
            fetchAndAssignMetaevidence(disputeID, x)
          })
          .then(
            p.archon.arbitrable
              .getEvidence(
                arbitrableAddress,
                p.contractAddress,
                event.evidenceGroupID
              )
              .then((evidences: EvidenceType[]) => {
                evidences.map((evidence: EvidenceType) =>
                  fetchAndAssignEvidence(disputeID, evidence)
                )
              })
          )
      })

    subscriptions.push(
      arbitrableInstanceAt(arbitrableAddress)
        .events.Evidence({
          filter,
        })
        .on("data", (event: any) => {
          p.archon.arbitrable
            .getEvidence(
              arbitrableAddress,
              p.contractAddress,
              event.returnValues._evidenceGroupID,
              {
                fromBlock: event.blockNumber,
              }
            )
            .then((evidence: EvidenceType) =>
              fetchAndAssignEvidence(disputeID, evidence)
            )
        })
    )
  }

  const disputeComponents = (
    contractAddress: string,
    networkType: string,
    activeWallet: string,
    items: DisputeType[],
    filter: number
  ) => {
    return items
      .sort(function (a: DisputeType, b: DisputeType) {
        return a.id - b.id
      })
      .filter(
        (item: DisputeType) =>
          item.statusERC792 === filter.toString() || filter === -1
      )
      .map((item: DisputeType) => (
        <Dispute
          activeWallet={activeWallet}
          appealPeriodEnd={Number(item.appealPeriodEnd || 0)}
          appealPeriodStart={Number(item.appealPeriodStart || 0)}
          arbitrated={item.arbitrated}
          archon={p.archon}
          autoAppealableArbitratorInstance={autoAppealableArbitratorInstance(
            contractAddress
          )}
          evidences={item.evidences}
          fee={item.fee}
          id={item.id}
          ipfsGateway={gateway}
          key={item.id}
          metaevidenceObject={item.metaevidenceObject}
          networkType={networkType}
          ruling={item.ruling || 0}
          status={item.statusERC792 || "0"}
        />
      ))
  }

  return (
    <div className="row">
      <div className="col">
        <div className="row">
          <div className="col">
            <h1>
              <b>Disputes</b>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="offset-md-10 col-md-2">
            <div className="input-group mb-3" style={{ width: "max-content" }}>
              <div className="input-group-prepend ml-auto " />
              <label className="secondary-inverted ">
                Filter: {disputeStatusToString(filter)}
              </label>
              <div className="input-group-append">
                <button
                  aria-expanded="false"
                  aria-haspopup="true"
                  className="btn dropdown-toggle dropdown-toggle-split "
                  data-toggle="dropdown"
                  type="button"
                >
                  <span className="sr-only">Toggle Dropdown</span>
                </button>
                <div className="dropdown-menu">
                  <button
                    className={`dropdown-item ${
                      filter === -1 ? "secondary" : ""
                    }`}
                    onClick={() => setFilter(-1)}
                  >
                    All
                  </button>
                  <div className="dropdown-divider m-0" role="separator" />
                  <button
                    className={`dropdown-item ${
                      filter === 0 ? "secondary" : ""
                    }`}
                    onClick={() => setFilter(0)}
                  >
                    Pending
                  </button>
                  <div className="dropdown-divider m-0" role="separator" />
                  <button
                    className={`dropdown-item ${
                      filter === 1 ? "secondary" : ""
                    }`}
                    onClick={() => setFilter(1)}
                  >
                    Active
                  </button>
                  <div className="dropdown-divider m-0" role="separator" />
                  <button
                    className={`dropdown-item ${
                      filter === 2 ? "secondary" : ""
                    }`}
                    onClick={() => setFilter(2)}
                  >
                    Closed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col px-0">
            <table className="table" id="disputes">
              <thead>
                <tr className="secondary">
                  <th>ID</th>
                  <th>Title</th>
                  <th>Arbitrable</th>
                  <th>Fee (Ether)</th>
                  <th>Status</th>
                  <th>
                    <FontAwesomeIcon icon="gavel" />
                  </th>
                </tr>
              </thead>

              {disputeComponents(
                p.contractAddress,
                p.networkType,
                p.activeWallet,
                disputes,
                filter
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisputeList
