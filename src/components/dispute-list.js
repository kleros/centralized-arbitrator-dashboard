import { autoAppealableArbitratorInstance, getDispute, getDisputeStatus } from "../ethereum/auto-appealable-arbitrator";
import Archon from "@kleros/archon";
import Dispute from "./dispute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { arbitrableInstanceAt } from "../ethereum/arbitrable";

class DisputeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disputes: [],
      filter: 0,
    };
    this.subscriptions = [];

    this.gateway = "https://ipfs.kleros.io";
  }

  setFilter = (filter) => async (_) => {
    this.setState({ filter });
  };

  disputeStatusToString = (code) => {
    switch (code) {
      case 0:
        return "Pending";
      case 1:
        return "Active";
      case 2:
        return "Closed";
      default:
        return "All";
    }
  };

  componentDidMount() {
    const { contractAddress } = this.props;

    const autoAppealableArbitrator = autoAppealableArbitratorInstance(contractAddress);
    this.getPastDisputeCreationsAndListenToNewOnes(autoAppealableArbitrator);
  }

  getPastDisputeCreationsAndListenToNewOnes(autoAppealableArbitrator) {
    autoAppealableArbitrator.getPastEvents("DisputeCreation", { fromBlock: 0 }).then((events) => events.map((event) => this.addDispute(event.returnValues._disputeID, event.returnValues._arbitrable, false)));

    this.subscriptions.push(autoAppealableArbitrator.events.DisputeCreation().on("data", (event) => this.addDispute(event.returnValues._disputeID, event.returnValues._arbitrable, true)));
  }

  componentDidUpdate(prevProps) {
    const { contractAddress } = this.props;

    if (contractAddress !== prevProps.contractAddress) {
      this.subscriptions.map((subscription) => subscription.unsubscribe());
      this.setState({ disputes: [] });
      const autoAppealableArbitrator = autoAppealableArbitratorInstance(contractAddress);
      this.getPastDisputeCreationsAndListenToNewOnes(autoAppealableArbitrator);
    }
  }

  fetchAndAssignEvidence = async (disputeID, evidence) => {
    const { disputes } = this.state;
    const targetIndex = disputes.findIndex((d) => d.id === disputeID);

    disputes[targetIndex].evidences = disputes[targetIndex].evidences || {};
    disputes[targetIndex].evidences[0] = disputes[targetIndex].evidences[0] || [];

    disputes[targetIndex].evidences[0].push(evidence);

    this.setState({ disputes });
  };

  fetchAndAssignMetaevidence = async (disputeID, evidence) => {
    const { disputes } = this.state;

    const targetIndex = disputes.findIndex((d) => d.id === disputeID);

    disputes[targetIndex].metaevidenceObject = evidence;

    this.setState({ disputes });
  };

  assignMetaEvidenceUsingArchon = () => {};

  addDispute = async (disputeID, arbitrableAddress, isNew) => {
    const { archon, contractAddress, notificationCallback } = this.props;

    const dispute = await getDispute(autoAppealableArbitratorInstance(contractAddress), disputeID);

    const date = new Date();

    if (isNew) notificationCallback(`New dispute #${disputeID} in contract ${contractAddress.substring(0, 8)}...`, date.getTime());

    dispute.id = disputeID;
    dispute.evidences = {};
    dispute.statusERC792 = await getDisputeStatus(autoAppealableArbitratorInstance(contractAddress), disputeID);

    await this.setState((state) => ({
      disputes: [...state.disputes, dispute],
    }));

    const arbitrable = arbitrableInstanceAt(arbitrableAddress);
    const filter = { _arbitrator: contractAddress, _disputeID: disputeID };
    const options = { filter, fromBlock: 0 };

    arbitrable.getPastEvents("Dispute", options).then((events) =>
      events.map((event) =>
        archon.arbitrable
          .getMetaEvidence(arbitrableAddress, event.returnValues._metaEvidenceID)
          .then((x) => this.fetchAndAssignMetaevidence(disputeID, x))
          .then(
            archon.arbitrable.getEvidence(arbitrableAddress, contractAddress, event.returnValues._metaEvidenceID).then((evidences) => {
              evidences.map((evidence) => this.fetchAndAssignEvidence(disputeID, evidence));
            })
          )
      )
    );

    arbitrable.events
      .Dispute({
        filter,
      })
      .on("data", (event) => {
        archon.arbitrable.getMetaEvidence(arbitrableAddress, event.returnValues._disputeID);
      });

    this.subscriptions.push(
      arbitrableInstanceAt(arbitrableAddress)
        .events.Evidence({
          filter,
        })
        .on("data", (event) => {
          archon.arbitrable
            .getEvidence(arbitrableAddress, contractAddress, disputeID, {
              fromBlock: event.blockNumber,
            })
            .then((evidence) => this.fetchAndAssignEvidence(disputeID, evidence));
        })
    );
  };

  disputeComponents = (contractAddress, networkType, activeWallet, items, filter) => {
    const { archon } = this.props;
    return items
      .sort(function (a, b) {
        return a.id - b.id;
      })
      .filter((item) => item.statusERC792 === filter.toString() || filter === -1)
      .map((item) => (
        <Dispute
          activeWallet={activeWallet}
          appealPeriodEnd={item.appealPeriodEnd || 0}
          appealPeriodStart={item.appealPeriodStart || 0}
          arbitrated={item.arbitrated}
          archon={archon}
          autoAppealableArbitratorInstance={autoAppealableArbitratorInstance(contractAddress)}
          choices={item.choices}
          evidences={item.evidences}
          fee={item.fees}
          id={item.id}
          ipfsGateway={this.gateway}
          key={item.id}
          metaevidenceObject={item.metaevidenceObject}
          networkType={networkType}
          ruling={item.ruling || "0"}
          status={item.statusERC792 || "0"}
        />
      ));
  };

  render() {
    const { activeWallet, contractAddress, networkType } = this.props;
    const { disputes, filter } = this.state;

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
                <label className="secondary-inverted ">Filter: {this.disputeStatusToString(filter)}</label>
                <div className="input-group-append">
                  <button aria-expanded="false" aria-haspopup="true" className="btn dropdown-toggle dropdown-toggle-split " data-toggle="dropdown" type="button">
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <div className="dropdown-menu">
                    <button className={`dropdown-item ${filter === -1 ? "secondary" : ""}`} onClick={this.setFilter(-1)}>
                      All
                    </button>
                    <div className="dropdown-divider m-0" role="separator" />
                    <button className={`dropdown-item ${filter === 0 ? "secondary" : ""}`} onClick={this.setFilter(0)}>
                      Pending
                    </button>
                    <div className="dropdown-divider m-0" role="separator" />
                    <button className={`dropdown-item ${filter === 1 ? "secondary" : ""}`} onClick={this.setFilter(1)}>
                      Active
                    </button>
                    <div className="dropdown-divider m-0" role="separator" />
                    <button className={`dropdown-item ${filter === 2 ? "secondary" : ""}`} onClick={this.setFilter(2)}>
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

                {this.disputeComponents(contractAddress, networkType, activeWallet, disputes, filter)}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DisputeList.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  contractAddress: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired,
  notificationCallback: PropTypes.func.isRequired,
};

export default DisputeList;
