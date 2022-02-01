import { autoAppealableArbitratorInstance, getArbitrationCost, setArbitrationPrice } from "../ethereum/auto-appealable-arbitrator";
import PropTypes from "prop-types";
import React from "react";

class ArbitrationPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arbitrationCost: "Fetching...",
    };
  }

  async componentDidMount() {
    const { contractAddress, web3 } = this.props;

    this.setState({
      arbitrationCost: web3.utils.fromWei(await getArbitrationCost(autoAppealableArbitratorInstance(contractAddress), ""), "ether"),
    });
  }

  async componentDidUpdate(prevProps) {
    const { activeWallet, contractAddress, web3 } = this.props;

    if (contractAddress !== prevProps.contractAddress || activeWallet !== prevProps.activeWallet)
      this.setState({
        arbitrationCost: web3.utils.fromWei(await getArbitrationCost(autoAppealableArbitratorInstance(contractAddress), ""), "ether"),
      });
  }

  handleSetArbitrationPriceButtonClick = (newCost) => async (e) => {
    const { activeWallet, contractAddress, web3 } = this.props;

    const autoAppealableArbitrator = autoAppealableArbitratorInstance(contractAddress);
    e.preventDefault();
    this.setState({ arbitrationCost: "awaiting..." });
    await setArbitrationPrice(activeWallet, autoAppealableArbitrator, web3.utils.toWei(newCost, "ether"));
    const arbitrationCost = web3.utils.fromWei(await getArbitrationCost(autoAppealableArbitrator, ""), "ether");
    this.setState({ arbitrationCost });
  };

  handleArbitrationPriceChange = () => (e) => {
    console.log(e);
    this.setState({ arbitrationCost: e.target.value });
  };

  render() {
    const { arbitrationCost } = this.state;
    return (
      <div className="input-group mb-3">
        <div className="input-group-append">
          <label className="input-group-text bg-white border-0" id="">
            Arbitration Price (ETH)
          </label>
        </div>
        <input aria-describedby="basic-addon" aria-label="" className="form-control" onChange={this.handleArbitrationPriceChange()} placeholder="Arbitration Price" type="text" value={arbitrationCost} />
        <div className="input-group-prepend">
          <button className="btn btn-primary primary" onClick={this.handleSetArbitrationPriceButtonClick(arbitrationCost)} type="button">
            Change Arbitration Fee
          </button>
        </div>
      </div>
    );
  }
}

ArbitrationPrice.propTypes = {
  activeWallet: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  web3: PropTypes.object.isRequired,
};

export default ArbitrationPrice;
