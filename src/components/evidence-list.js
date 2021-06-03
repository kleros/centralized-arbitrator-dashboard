import Evidence from "./evidence";
import Identicon from "./identicon.js";
import PropTypes from "prop-types";
import React from "react";

class EvidenceList extends React.Component {
  constructor(props) {
    super(props);
    console.log("EVIDENCELISTPROPS");
    console.log(props);
  }
  evidences = (evidences, ipfsGateway) => {
    const items = evidences.map((item) => (
      <Evidence
        description={item && item.evidenceJSON.description}
        evidenceJSONValid={item && item.evidenceJSONValid}
        fileHash={item && item.evidenceJSON.fileHash}
        fileURI={item && item.evidenceJSON.fileURI}
        ipfsGateway={ipfsGateway}
        key={item && item.evidenceJSON.name + item.evidenceJSON.fileURI}
        name={item && item.evidenceJSON.name}
      />
    ));

    return items;
  };

  isEvidenceIntegrityOK = (evidences) => {
    if (evidences.length === 0) return true;
    return evidences.map((evidence) => evidence.fileValid).reduce((op1, op2) => op1 && op2);
  };

  render() {
    const { address, aliases, evidences, ipfsGateway, name } = this.props;
    if (evidences.length > 0)
      return (
        <div>
          <div className="row m-1">
            <div className="col">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a aria-controls="evidence" aria-selected="true" className="nav-link active" data-toggle="tab" href="#evidence" id="evidence-tab" rel="noopener noreferrer" role="tab" target="_blank">
                    <h6 className="secondary-inverted">
                      <b>Evidences</b>
                    </h6>
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div aria-labelledby="home-tab" className="tab-pane fade show active" id="evidence" role="tabpanel">
                  <div className="row">
                    <div className="col-md-8 text-left">{this.evidences.length > 0 && this.evidences(evidences, ipfsGateway)}</div>
                    {!this.isEvidenceIntegrityOK(evidences) && (
                      <div className="col-md-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    else return null;
  }
}

EvidenceList.defaultProps = {
  evidences: [],
};

EvidenceList.propTypes = {
  address: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
  evidences: PropTypes.arrayOf(
    PropTypes.shape({
      blockNumber: PropTypes.number,
      evidenceJSON: PropTypes.shape({
        fileURI: PropTypes.string,
      }),
      evidenceJSONValid: PropTypes.bool,
      fileValid: PropTypes.bool,
      submittedAt: PropTypes.number,
      submittedBy: PropTypes.string,
      transactionHash: PropTypes.string,
    })
  ),
  ipfsGateway: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default EvidenceList;
