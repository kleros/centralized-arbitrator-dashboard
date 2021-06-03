import { giveAppealableRuling, giveRuling } from "../ethereum/auto-appealable-arbitrator";
import Archon from "@kleros/archon";
import EvidenceList from "./evidence-list";
import Lodash from "lodash";
import PropTypes from "prop-types";
import React from "react";
import TimeAgo from "react-timeago";
import Web3 from "../ethereum/web3";

class DisputeDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appealFee: 0.1,
      appealable: true,
      timeToAppeal: 240,
    };
  }

  handleGiveRulingButtonClick = (account, instance, id, ruling) => () => {
    const { appealFee, appealable, timeToAppeal } = this.state;
    if (appealable) giveAppealableRuling(account, instance, id, ruling, Web3.utils.toWei(appealFee.toString(), "ether"), timeToAppeal);
    /* Why don't we await? */ else giveRuling(account, instance, id, ruling); /* Why don't we await? */
  };

  handleAppealableRulingCheckboxClick = () => (_) => {
    console.log("handlecheckbox");
    this.setState((prevState) => ({ appealable: !prevState.appealable }));
  };

  handleTimeToAppealChange = () => (e) => {
    console.log("handletimetoappeal");
    this.setState({ timeToAppeal: e.target.value });
  };

  handleAppealFeeChange = () => (e) => {
    console.log("handleAppealFeeChange");
    this.setState({ appealFee: e.target.value });
  };

  renderedRulingOptions = (options, activeWallet, centralizedArbitratorInstance, id) =>
    Lodash.zip(options.titles, options.descriptions).map((option, key) => (
      <div className="col">
        <button className="btn btn-primary btn-lg primary " key={key + 1} onClick={this.handleGiveRulingButtonClick(activeWallet, centralizedArbitratorInstance, id, key + 1)}>
          {option[0]}
        </button>
      </div>
    ));

  render() {
    const {
      activeWallet,
      aliases,
      appealPeriodEnd,
      arbitrableContractAddress,
      archon,
      category,
      centralizedArbitratorInstance,
      description,
      evidenceDisplayInterfaceURI,
      evidences,
      fileURI,
      fileValid,
      id,
      ipfsGateway,
      metaEvidenceJSONValid,
      question,
      ruling,
      rulingOptions,
      status,
      title,
    } = this.props;
    console.log(evidences);
    const { appealFee, appealable, timeToAppeal } = this.state;

    return (
      <div className="container">
        <div className="row p-0">
          <div className="col p-0">
            <h3 className="float-left">
              <b>{`${title}`}</b>
            </h3>
          </div>
          <div className="col p-0">
            <h3 className="float-right">
              <b>{`${category}`}</b>
            </h3>
          </div>
        </div>
        <br />
        <div className="row p-0">
          <div className="col p-0 text-left">
            <h4 className="">{description}</h4>
          </div>
        </div>
        <br />
        {evidenceDisplayInterfaceURI && (
          <div className="row">
            <div className="col">
              <div className="embed-responsive embed-responsive-21by9" style={{ height: "200px" }}>
                <iframe
                  className="embed-responsive-item"
                  src={
                    (evidenceDisplayInterfaceURI.includes("://") ? evidenceDisplayInterfaceURI : `https://ipfs.kleros.io${evidenceDisplayInterfaceURI}`) +
                    encodeURI(`{"arbitrableContractAddress":"${arbitrableContractAddress}","arbitratorContractAddress":"${centralizedArbitratorInstance._address}","disputeID":"${id}"}`)
                  }
                  title="evidence-display"
                />
              </div>
            </div>
          </div>
        )}
        <br />
        <div className="row border p-3" id="fileURICard">
          <div className="col">
            <a href={ipfsGateway + fileURI} rel="noopener noreferrer" target="_blank">
              <img className="mr-3" style={{ maxHeight: "1em", verticalAlign: "text-bottom" }} alt="Primary Document" title="Primary Document" src="text.svg" />
              Primary Document
            </a>
          </div>

          {(!fileValid || !metaEvidenceJSONValid) && (
            <div className="col-md-2">
              <div className="row">
                <div className="col-md-8 py-2 ">
                  <h6 className="">Integrity Broken!</h6>
                </div>
                <div className="col-md-3 ">
                  <img alt="warning" className="" src="warning.svg" />
                </div>
                <div className="offset-md-1" />
              </div>
            </div>
          )}
        </div>

        <br />
        <div className="row">
          <div className="col">
            <EvidenceList address={"0x0"} aliases={aliases} archon={archon} evidences={evidences[0]} ipfsGateway={ipfsGateway} name={"Evidences"} />
          </div>
        </div>
        <br />

        {status === "0" && (
          <div>
            <div className="mb-5">
              <div className="row" id="appealable-ruling">
                <div className="col">
                  <div className="custom-control custom-checkbox">
                    <input aria-label="Checkbox for following text input" className="custom-control-input" defaultChecked={appealable} id={"appealable" + id} onClick={this.handleAppealableRulingCheckboxClick()} type="checkbox" />
                    <label className="custom-control-label" htmlFor={"appealable" + id}>
                      <h4>Give an appealable ruling</h4>
                    </label>
                  </div>
                </div>
              </div>
              {appealable && (
                <>
                  <div className="row border background-shade pt-3">
                    <div className="col-4 offset-1">
                      <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text background-shade border-0" id="inputGroup-sizing-sm">
                            Appeal Fee(ETH)
                          </span>
                        </div>
                        <input aria-describedby="inputGroup-sizing-sm" aria-label="Small" className="form-control" onChange={this.handleAppealFeeChange()} type="number" value={appealFee} />
                      </div>
                    </div>
                    <div className="col-2">
                      <hr
                        className="mt-0"
                        style={{
                          background: "#CCCCCC",
                          border: "none",
                          height: "30px",
                          width: "1px",
                        }}
                      />
                    </div>
                    <div className="col-4">
                      <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text background-shade border-0" id="inputGroup-sizing-sm">
                            Time to Appeal(Seconds)
                          </span>
                        </div>
                        <input aria-describedby="inputGroup-sizing-sm" aria-label="Small" className="form-control" onChange={this.handleTimeToAppealChange()} type="number" value={timeToAppeal} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="row">
              <div className="col">
                <h4 className="">{question}</h4>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="offset-md-2 col-md-3">
                <button className="btn btn-primary btn-lg btn-block primary" onClick={this.handleGiveRulingButtonClick(activeWallet, centralizedArbitratorInstance, id, 1)}>
                  {(rulingOptions && rulingOptions.titles && rulingOptions.titles[0]) || "Not Provided"}
                </button>
              </div>
              <div className="col-md-2">X</div>
              <div className="col-md-3">
                <button className="btn btn-primary btn-lg btn-block primary" onClick={this.handleGiveRulingButtonClick(activeWallet, centralizedArbitratorInstance, id, 2)}>
                  {(rulingOptions && rulingOptions.titles && rulingOptions.titles[1]) || "Not Provided"}
                </button>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="offset-md-4 col-md-4 mb-5">
                <button className="btn btn-primary btn-lg btn-block secondary" onClick={this.handleGiveRulingButtonClick(activeWallet, centralizedArbitratorInstance, id, 0)}>
                  {rulingOptions && `Refuse to Arbitrate`}
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "1" && (
          <div className="row px-0">
            <div className="col px-0">
              <div
                className="text-white pt-5"
                style={{
                  background: "url(kleros-gavel.svg), url(dispute_detail_rectangle.svg) no-repeat center center",
                  "background-position": "center",
                  "background-repeat": "no-repeat, no-repeat",
                  "background-size": "auto, cover",
                  height: "200px",
                  width: "100%",
                }}
              >
                <h1>
                  <b> You voted for {ruling && aliases[Object.keys(aliases)[ruling - 1]]} </b>
                </h1>
                {appealPeriodEnd * 1000 < new Date().getTime() && <h2>Appeal period is over.</h2>}
                {appealPeriodEnd * 1000 > new Date().getTime() && (
                  <h2>
                    The case can still be appealable until <TimeAgo date={appealPeriodEnd * 1000} />
                  </h2>
                )}
              </div>
            </div>
          </div>
        )}

        {status === "2" && (
          <div className="row px-0">
            <div className="col px-0">
              <div
                className="text-white pt-5"
                style={{
                  background: "url(kleros-gavel.svg), url(dispute_detail_rectangle.svg) no-repeat center center",
                  "background-position": "center",
                  "background-repeat": "no-repeat, no-repeat",
                  "background-size": "auto, cover",
                  height: "200px",
                  width: "100%",
                }}
              >
                <h1>
                  <b>Decision: {ruling && rulingOptions && rulingOptions.titles[ruling - 1]}</b>
                </h1>
                <h2>The case is closed</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

DisputeDetail.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
  appealPeriodEnd: PropTypes.number.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  archon: PropTypes.instanceOf(Archon).isRequired,
  category: PropTypes.number.isRequired,
  centralizedArbitratorInstance: PropTypes.instanceOf(Web3.eth.Contract).isRequired,
  description: PropTypes.string.isRequired,
  evidenceDisplayInterfaceURI: PropTypes.string,
  evidences: PropTypes.arrayOf(PropTypes.string).isRequired,
  fileURI: PropTypes.string.isRequired,
  fileValid: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
  ipfsGateway: PropTypes.string.isRequired,
  metaEvidenceJSONValid: PropTypes.bool.isRequired,
  question: PropTypes.string.isRequired,
  ruling: PropTypes.string.isRequired,
  rulingOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

DisputeDetail.defaultProps = { evidenceDisplayInterfaceURI: "" };

export default DisputeDetail;
