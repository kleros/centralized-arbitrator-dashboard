import {
  autoAppealableArbitratorInstance,
  getDispute,
  getDisputeStatus,
} from "../ethereum/auto-appealable-arbitrator"
import Dispute from "./Dispute"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useEffect, useState } from "react"
import { DisputeType, ReturnPastEvents } from "../types"
import Archon from "@kleros/archon"
import { Contract } from "ethers"

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

  const getPastDisputeCreationsAndListenToNewOnes = (
    autoAppealableArbitrator: Contract
  ) => {
    autoAppealableArbitrator
      .getPastEvents("DisputeCreation", { fromBlock: 0 })
      .then(
        async (events: ReturnPastEvents[]) =>
          await addAllDisputes(events, false)
      )

    subscriptions.push(
      autoAppealableArbitrator.events
        .DisputeCreation()
        .on("data", async (event: ReturnPastEvents) => {
          await addOneDispute(event, true)
        })
    )
  }

  const addOneDispute = async (event: ReturnPastEvents, isNew: boolean) => {
    const dispute = await getDispute(
      autoAppealableArbitratorInstance(p.contractAddress),
      event.returnValues._disputeID
    )
    const disputeModified = {
      ...dispute,
      id: event.returnValues._disputeID,
      statusERC792: await getDisputeStatus(
        autoAppealableArbitratorInstance(p.contractAddress),
        event.returnValues._disputeID
      ),
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
        `New dispute in contract ${p.contractAddress.substring(0, 8)}...`,
        date.getTime()
      )
    setDisputes([...disputes, disputeModified])
  }

  const addAllDisputes = async (events: ReturnPastEvents[], isNew: boolean) => {
    const readyDisputes: DisputeType[] = []
    let allowedToContinue = false
    const prepareDisputes = async () => {
      for (let i = 0; i < events.length; i++) {
        const dispute = await getDispute(
          autoAppealableArbitratorInstance(p.contractAddress),
          events[i].returnValues._disputeID
        )
        const disputeModified = {
          ...dispute,
          id: events[i].returnValues._disputeID,
          statusERC792: await getDisputeStatus(
            autoAppealableArbitratorInstance(p.contractAddress),
            events[i].returnValues._disputeID
          ),
          metaevidenceObject: {
            metaEvidenceJSON: {
              title: "",
            },
          },
          evidenceArray: [],
        }
        readyDisputes.push(disputeModified)
      }
      allowedToContinue = true
    }

    await prepareDisputes()

    if (!allowedToContinue) return

    const date = new Date()

    if (isNew)
      p.notificationCallback(
        `New dispute in contract ${p.contractAddress.substring(0, 8)}...`,
        date.getTime()
      )
    setDisputes(readyDisputes)
  }

  const disputeComponents = (items: DisputeType[], filter: number) => {
    if (items.length === 0) {
      return "Loading..."
    }
    return items
      .sort((a: DisputeType, b: DisputeType) => {
        return a.id - b.id
      })
      .filter(
        (item: DisputeType) =>
          item.statusERC792 === filter.toString() || filter === -1
      )
      .map((d: DisputeType) => {
        return (
          <Dispute
            contractAddress={p.contractAddress}
            activeWallet={p.activeWallet}
            appealPeriodEnd={Number(d.appealPeriodEnd || 0)}
            appealPeriodStart={Number(d.appealPeriodStart || 0)}
            arbitrated={d.arbitrated.toLocaleLowerCase()}
            archon={p.archon}
            autoAppealableArbitratorInstance={autoAppealableArbitratorInstance(
              p.contractAddress
            )}
            evidenceArray={d.evidenceArray}
            fees={d.fees}
            id={d.id}
            ipfsGateway={gateway}
            key={d.id}
            metaevidenceObject={d.metaevidenceObject}
            networkType={p.networkType}
            ruling={d.ruling || 0}
            status={d.statusERC792 || "0"}
          />
        )
      })
  }
  if (disputes.length === 0) {
    return <div>disputes loading...</div>
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
              {disputeComponents(disputes, filter)}
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisputeList
