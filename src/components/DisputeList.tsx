import {
  autoAppealableArbitratorInstance,
  getDispute,
  getDisputeStatus,
} from "../ethereum/auto-appealable-arbitrator"
//import Archon from "@kleros/archon"
import Dispute from "./Dispute"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useEffect, useState } from "react"
import { arbitrableInstanceAt } from "../ethereum/arbitrable"
import { getReadOnlyRpcUrl } from "../ethereum/web3"
import web3 from "../ethereum/web3"
//import Evidence from "./Evidence"
import { DisputeType, EvidenceType } from "../types"
import { cloneDeep } from "lodash"

const DisputeList: FC<{
  activeWallet: string
  archon: any
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
    let cancel = false
    const autoAppealableArbitrator = autoAppealableArbitratorInstance(
      p.contractAddress
    )
    if (cancel) return
    getPastDisputeCreationsAndListenToNewOnes(autoAppealableArbitrator)
    return () => {
      cancel = true
    }
  }, [p.contractAddress])

  //console.info(`Fetching meta evidence and TCR data of TCR at ${tcr.address}`)

  // Fetch meta evidence. (Make this an independent function)
  // const logs = (
  //   await provider.getLogs({
  //     ...tcr.filters.MetaEvidence(),
  //     fromBlock: deploymentBlock
  //   })
  // ).map(log => tcr.interface.parseLog(log))
  // const { _evidence: metaEvidencePath } = logs[logs.length - 1].values
  // const tcrMetaEvidence = await (
  //   await fetch(process.env.IPFS_GATEWAY + metaEvidencePath)
  // ).json()

  // Fetch TCR data. (Make this an independent function)
  // let data
  // try {
  //   data = await gtcrView.fetchArbitrable(tcr.address)
  // } catch (err) {
  //   console.warn(`Error fetching arbitrable data for TCR @ ${tcr.address}`, err)
  //   console.warn(`This TCR will not be tracked by the bot.`)
  //   return
  // }

  const getPastDisputeCreationsAndListenToNewOnes = (
    autoAppealableArbitrator: any
  ) => {
    autoAppealableArbitrator
      .getPastEvents("DisputeCreation", { fromBlock: 0 })
      .then((events: any[]) =>
        events.map(async (event) => {
          addDispute(event.returnValues._disputeID, false)
        })
      )

    subscriptions.push(
      autoAppealableArbitrator.events
        .DisputeCreation()
        .on("data", (event: any) =>
          addDispute(event.returnValues._disputeID, true)
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

    if (disputes[targetIndex]) {
      const evidenceArrayToModify = cloneDeep(
        disputes[targetIndex].evidenceArray
      )
      const evidenceArrayModified = evidenceArrayToModify.concat(evidence)
      const evidenceUniqueArray = [
        ...new Map(
          evidenceArrayModified.map((item: EvidenceType) => [
            item["submittedAt"],
            item,
          ])
        ).values(),
      ]
      const allDisputesClone = cloneDeep(disputes)
      const disputeModified = {
        ...allDisputesClone[targetIndex],
        evidenceArray: evidenceUniqueArray,
      }
      const disputesArrayModified = allDisputesClone.map((d) =>
        d.id === disputeID ? disputeModified : d
      )
      setDisputes(disputesArrayModified)
    }
  }

  const fetchAndAssignMetaevidence = async (
    disputeID: number,
    evidence: EvidenceType
  ) => {
    const targetIndex = disputes.findIndex(
      (d: DisputeType) => d.id === disputeID
    )
    if (disputes[targetIndex] !== undefined) {
      const allDisputesClone = cloneDeep(disputes)
      const disputeModified = {
        ...allDisputesClone[targetIndex],
        metaevidenceObject: evidence,
      }
      const disputesArrayModified = allDisputesClone.map((d) =>
        d.id === disputeID ? disputeModified : d
      )
      setDisputes(disputesArrayModified)
    }
  }

  //const assignMetaEvidenceUsingArchon = () => {}

  const addDispute = async (disputeID: number, isNew: boolean) => {
    const dispute = await getDispute(
      autoAppealableArbitratorInstance(p.contractAddress),
      disputeID
    )

    const disputeWithMetaevidenceField = {
      ...dispute,
      metaevidenceObject: {
        metaEvidenceJSON: {
          title: "",
        },
      },
      evidenceArray: [],
    }

    const date = new Date()

    if (isNew)
      p.notificationCallback(
        `New dispute #${disputeID} in contract ${p.contractAddress.substring(
          0,
          8
        )}...`,
        date.getTime()
      )

    disputeWithMetaevidenceField.id = disputeID
    disputeWithMetaevidenceField.evidences = {}
    disputeWithMetaevidenceField.statusERC792 = await getDisputeStatus(
      autoAppealableArbitratorInstance(p.contractAddress),
      disputeID
    )

    setDisputes([...disputes, disputeWithMetaevidenceField])
  }

  const disputeComponents = (
    contractAddress: string,
    networkType: string,
    activeWallet: string,
    items: DisputeType[],
    filter: number
  ) => {
    return items
      .sort((a: DisputeType, b: DisputeType) => {
        return a.id - b.id
      })
      .filter(
        (item: DisputeType) =>
          item.statusERC792 === filter.toString() || filter === -1
      )
      .map(async (item: DisputeType) => {
        const filter = { _arbitrator: p.contractAddress, _disputeID: item.id }

        const currentChainID = (await web3.eth.getChainId()).toString()

        p.archon.arbitrable
          .getDispute(
            item.arbitrated.toLowerCase(),
            p.contractAddress,
            item.id,
            {
              fromBlock: 0,
            }
          )
          .then((event: any) => {
            return p.archon.arbitrable
              .getMetaEvidence(item.arbitrated, event.metaEvidenceID, {
                strict: true,
                getJsonRpcUrl: (chainId: number) =>
                  getReadOnlyRpcUrl({ chainId }),
                scriptParameters: {
                  disputeID: item.id,
                  arbitratorChainID: currentChainID,
                  arbitratorContractAddress: p.contractAddress,
                },
              })
              .then((x: EvidenceType) => {
                if (disputes) {
                  fetchAndAssignMetaevidence(item.id, x)
                }
              })
              .then(
                p.archon.arbitrable
                  .getEvidence(
                    item.arbitrated.toLowerCase(),
                    p.contractAddress,
                    event.evidenceGroupID
                  )
                  .then((evidences: EvidenceType[]) => {
                    if (disputes) {
                      evidences.map((evidence: EvidenceType) =>
                        fetchAndAssignEvidence(item.id, evidence)
                      )
                    }
                  })
              )
          })

        subscriptions.push(
          arbitrableInstanceAt(item.arbitrated.toLowerCase())
            .events.Evidence({
              filter,
            })
            .on("data", (event: any) => {
              p.archon.arbitrable
                .getEvidence(
                  item.arbitrated.toLowerCase(),
                  p.contractAddress,
                  event.returnValues._evidenceGroupID,
                  {
                    fromBlock: event.blockNumber,
                  }
                )
                .then((evidence: EvidenceType) =>
                  fetchAndAssignEvidence(item.id, evidence)
                )
            })
        )
        console.log("si llegas hasta aquí, porque pollas no ejecutas Dispute?")
        return (
          <Dispute
            activeWallet={activeWallet}
            appealPeriodEnd={Number(item.appealPeriodEnd || 0)}
            appealPeriodStart={Number(item.appealPeriodStart || 0)}
            arbitrated={item.arbitrated.toLocaleLowerCase()}
            archon={p.archon}
            autoAppealableArbitratorInstance={autoAppealableArbitratorInstance(
              contractAddress
            )}
            evidenceArray={item.evidenceArray}
            fees={item.fees}
            id={item.id}
            ipfsGateway={gateway}
            key={item.id}
            metaevidenceObject={item.metaevidenceObject}
            networkType={networkType}
            ruling={item.ruling || 0}
            status={item.statusERC792 || "0"}
          />
        )
      })
  }
  disputeComponents(
    p.contractAddress,
    p.networkType,
    p.activeWallet,
    disputes,
    filter
  )

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
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisputeList
