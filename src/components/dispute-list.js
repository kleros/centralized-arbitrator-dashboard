import {
  centralizedArbitratorInstance,
  getDispute,
  getDisputeStatus
} from "../ethereum/centralized-arbitrator";
import Dispute from "./dispute";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React from "react";
import { arbitrableInstanceAt } from "../ethereum/arbitrable";
import update from "immutability-helper";

class DisputeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disputes: []
    };
    this.subscriptions = {
      dispute: undefined,
      disputeCreation: undefined,
      evidence: undefined,
      metaevidence: undefined,
      ruling: undefined
    };

    this.gateway = "https://ipfs.io";
  }

  componentDidMount() {
    const { contractAddress } = this.props;

    const centralizedArbitrator = centralizedArbitratorInstance(
      contractAddress
    );

    centralizedArbitrator
      .getPastEvents("DisputeCreation", { fromBlock: 0 })
      .then(events =>
        events.map(event => {
          console.log("CHECKTHISOUT");
          console.log(event);
          return this.addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable
          );
        })
      );

    this.subscriptions.disputeCreation = centralizedArbitrator.events
      .DisputeCreation()
      .on("data", event =>
        this.addDispute(
          event.returnValues._disputeID,
          event.returnValues._arbitrable
        )
      );
  }

  componentDidUpdate(prevProps) {
    const { contractAddress } = this.props;

    if (contractAddress !== prevProps.contractAddress) {
      this.subscriptions = {};
      this.setState({ disputes: [] });
      this.subscriptions.disputeCreation = centralizedArbitratorInstance(
        contractAddress
      )
        .events.DisputeCreation({}, { fromBlock: 0, toBlock: "latest" })
        .on("data", event => {
          this.addDispute(
            event.returnValues._disputeID,
            event.returnValues._arbitrable
          );
        })
        .on("error", console.error);
    }
  }

  updateEvidence = async (disputeID, party, evidence) => {
    const { disputes } = this.state;
    const targetIndex = disputes.findIndex(d => d.id === disputeID);
    console.log("do we have the dispute?");
    console.log(disputes[targetIndex]);
    console.log("disputeID");
    console.log(disputeID);
    console.log("disputes");
    console.log(disputes);

    disputes[targetIndex].evidences = disputes[targetIndex].evidences || {};
    disputes[targetIndex].evidences[party] =
      disputes[targetIndex].evidences[party] || [];

    console.log("evidence");
    console.log(evidence);

    fetch(this.gateway + evidence).then(response =>
      response
        .json()
        .catch(function() {
          console.log("error");
        })
        .then(data => disputes[targetIndex].evidences[party].push(data))
    );
  };

  updateDispute = async (disputeID, evidence) => {
    const { disputes } = this.state;

    console.log("disputes");
    console.log(disputes);
    console.log("disputeID");
    console.log(disputeID);

    const targetIndex = disputes.findIndex(d => d.id === disputeID);

    fetch(this.gateway + evidence)
      .then(response => response.json())
      .then(
        metaevidence => (disputes[targetIndex].metaevidence = metaevidence)
      );

    this.setState({ disputes });
  };

  assignMetaevidence = (disputeID, metaEvidenceEvent) => {
    const { disputes } = this.state;

    console.log("disputes");
    console.log(disputes);
    console.log("disputeID");
    console.log(disputeID);

    const targetIndex = disputes.findIndex(d => d.id === disputeID);
    console.log("TARGETINDEX");
    console.log(targetIndex);
    disputes[targetIndex].metaevidence =
      metaEvidenceEvent[0].returnValues._evidence;
    console.log(disputes);
    this.setState({ disputes });
  };

  updateRuling = async event => {
    console.log("eventscheme");
    console.log(event);
    const { disputes } = this.state;
    const disputeID = parseInt(event.returnValues._disputeID);
    const targetIndex = disputes.findIndex(d => d.id === disputeID);

    disputes[targetIndex].ruling = event.returnValues[2];
    disputes[targetIndex].status = await getDisputeStatus(
      event.returnValues._disputeID
    );

    this.setState({ disputes });
  };

  addDispute = async (disputeID, arbitrableAddress) => {
    this.props.notificationCallback();
    const { contractAddress } = this.props;

    console.log("ARGS");
    console.log(arbitrableAddress);

    const dispute = await getDispute(
      centralizedArbitratorInstance(contractAddress),
      disputeID
    );
    if (dispute.status === "2") return;

    dispute.id = disputeID;
    dispute.evidences = {};

    await this.setState(state => ({
      disputes: [...state.disputes, dispute]
    }));

    const arbitrable = arbitrableInstanceAt(arbitrableAddress);
    const filter = { _disputeID: disputeID, _arbitrator: contractAddress };
    const options = { filter, fromBlock: 0 };

    arbitrable.getPastEvents("Dispute", options).then(events =>
      events.map(event =>
        arbitrable
          .getPastEvents("MetaEvidence", {
            filter: { _metaEvidenceID: event.returnValues._metaEvidenceID },
            fromBlock: 0
          })
          .then(events =>
            this.updateDispute(disputeID, events[0].returnValues._evidence)
          )
      )
    );

    arbitrable
      .getPastEvents("Evidence", options)
      .then(events =>
        events.map(event =>
          this.updateEvidence(
            disputeID,
            event.returnValues._party,
            event.returnValues._evidence
          )
        )
      );

    arbitrable
      .getPastEvents("Ruling", options)
      .then(events => events.map(event => this.updateRuling(event)));

    this.forceUpdate();

    return;

    this.subscriptions.dispute = await arbitrable.events
      .Dispute({
        filter
      })
      .on("data", event => {
        this.assignMetaevidence(
          arbitrableAddress,
          event.returnValues._disputeID,
          event.returnValues._metaEvidenceID
        );
      });

    this.subscriptions.evidence = await arbitrableInstanceAt(arbitrableAddress)
      .events.Evidence({
        filter
      })
      .on("data", event => {
        this.updateEvidence(
          disputeID,
          event.returnValues._party,
          event.returnValues._evidence
        );
      });

    this.subscriptions.ruling = await arbitrableInstanceAt(arbitrableAddress)
      .events.Ruling({
        filter
      })
      .on("data", event => {
        this.updateRuling(event);
      });
  };

  disputeComponents = (contractAddress, networkType, activeWallet, items) =>
    items
      .sort(function(a, b) {
        return a.id - b.id;
      })
      .map(item => (
        <Dispute
          activeWallet={activeWallet}
          arbitrated={item.arbitrated}
          centralizedArbitratorInstance={centralizedArbitratorInstance(
            contractAddress
          )}
          choices={item.choices}
          evidences={item.evidences}
          fee={item.fee}
          id={item.id}
          ipfsGateway={this.gateway}
          key={item.id}
          metaevidence={item.metaevidence}
          networkType={networkType}
          status={item.status || "0"}
        />
      ));

  render() {
    const { activeWallet, contractAddress, networkType } = this.props;
    const { disputes } = this.state;
    console.log("final disputes");
    console.log(disputes);
    return (
      <div>
        <h1>
          <b>Disputes That Await Your Arbitration</b>
        </h1>

        <table className="table table-hover" id="disputes">
          <thead>
            <tr className="secondary">
              <th>ID</th>
              <th>Arbitrable</th>
              <th>Fee (Ether)</th>
              <th>Status</th>
              <th>
                <FontAwesomeIcon icon="gavel" />
              </th>
            </tr>
          </thead>

          {this.disputeComponents(
            contractAddress,
            networkType,
            activeWallet,
            disputes
          )}
        </table>
      </div>
    );
  }
}

DisputeList.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  networkType: PropTypes.string.isRequired
};

export default DisputeList;
