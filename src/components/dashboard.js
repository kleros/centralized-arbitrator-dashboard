import $ from "jquery";
import ArbitrationPrice from "./arbitration-price";
import Archon from "@kleros/archon";
import DisputeList from "./dispute-list";
import Identicon from "./identicon.js";
import NavBar from "./navbar.js";
// import { RateLimiter } from 'limiter'
import React from "react";
import { deployAutoAppealableArbitrator } from "../ethereum/auto-appealable-arbitrator";
import web3 from "../ethereum/web3";

import lscache from "lscache";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arbitrationCost: "",
      notifications: [],
      owner: "",
      selectedAddress: undefined,
      uglyFixtoBug13: "", // See https://github.com/kleros/centralized-arbitrator-dashboard/issues/13
    };
  }

  // eventNotificationServiceRoute(address, eventName, networkName) {
  //   if (networkName === "main") return `https://events.kleros.io/contracts/${address}/listeners/${eventName}/callbacks`;
  //   else return `https://kovan-events.kleros.io/contracts/${address}/listeners/${eventName}/callbacks`;
  // }

  // scanContracts(networkType, account) {
  //   const limiter = new RateLimiter(1, 250);
  //   const api = {
  //     kovan: "api-kovan.",
  //     mainnet: "api.",
  //   };
  //   console.log(networkType);
  //   const apiPrefix = networkType === "main" ? api.mainnet : api.kovan;
  //
  //   fetch(
  //     `https://${apiPrefix}etherscan.io/api?module=account&action=txlist&address=${account}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
  //   )
  //     .then((response) => response.json())
  //     .then((data) =>
  //       data.result
  //         .filter(({ to }) => to === "")
  //         .map((item) => item.contractAddress)
  //     )
  //     .then((addresses) =>
  //       addresses.map((address) =>
  //         limiter.removeTokens(1, async () =>
  //           fetch(
  //             `https://${apiPrefix}etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=YHYC1VSRWMQ3M5BF1TV1RRS3N7QZ8FQPEV`
  //           )
  //             .then((response) => response.json())
  //             .then((data) => {
  //               if (
  //                 data.result[0].ContractName === "AutoAppealableArbitrator"
  //               ) {
  //                 this.setState((state) => ({
  //                   contractAddresses: [...state.contractAddresses, address],
  //                 }));
  //
  //                 // Call eventNotificationService here
  //
  //                 if (!window.localStorage.getItem(account))
  //                   window.localStorage.setItem(account, address);
  //                 else
  //                   window.localStorage.setItem(
  //                     account,
  //                     window.localStorage
  //                       .getItem(account)
  //                       .concat(" ")
  //                       .concat(address)
  //                   );
  //               }
  //             })
  //         )
  //       )
  //     );
  // }

  apiPrefix = (networkType) => {
    switch (networkType) {
      case "main":
        return " ";
      case "kovan":
        return "kovan.";
      case "ropsten":
        return "ropsten.";
      default:
        return " ";
    }
  };

  async componentDidMount() {
    this.setState({
      archon: new Archon(window.web3.currentProvider, "https://ipfs.kleros.io"),
    });

    $("*").on("click", () => {
      this.setState({ uglyFixtoBug13: "" });
    });

    if (window.ethereum) {
      const ethereum = window.ethereum;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (lscache.get(accounts[0]))
        this.setState({
          selectedAddress: lscache.get(accounts[0])[0],
        });

      web3.eth.net.getNetworkType((error, networkType) => {
        this.setState({ networkType: networkType });
        this.setState({ wallet: accounts[0] });
      });
    } else console.log("MetaMask account not detected :(");

    window.ethereum.on("accountsChanged", (accounts) => {
      web3.eth.net.getNetworkType((error, networkType) => {
        if (error) console.error(error);
        console.log(accounts[0]);
        this.setState({ networkType: networkType });
        this.setState({ wallet: accounts[0] });
      });
    });
  }

  deploy = (account, arbitrationPrice) => async (e) => {
    e.preventDefault();

    const result = await deployAutoAppealableArbitrator(account, web3.utils.toWei(arbitrationPrice, "ether"));
    this.setState({ selectedAddress: result._address });

    if (!lscache.get(this.state.wallet)) lscache.set(this.state.wallet, [result._address]);
    else {
      const currentItem = lscache.get(this.state.wallet);
      let newItem = [...currentItem, result._address];
      lscache.set(this.state.wallet, newItem);
    }

    this.setState({ state: this.state });
  };

  handleCentralizedArbitratorDropdownKeyEnter = () => (e) => {
    if (e.keyCode === 13) this.setState({ selectedAddress: e.target.value });
  };

  handleCentralizedArbitratorDropdownButtonClick = (address) => (_) => {
    this.setState({ selectedAddress: address });
  };

  centralizedArbitratorButtons = (addresses) => {
    const { networkType } = this.state;
    return addresses.map((address) => (
      <div className="dropdown-item p-0" key={address}>
        <button className="dropdown-item " key={address} onClick={this.handleCentralizedArbitratorDropdownButtonClick(address)}>
          <a href={`https://${this.apiPrefix(networkType)}etherscan.io/address/${address}`} rel="noopener noreferrer" target="_blank">
            <img alt="etherscan-logo" className="m-2" height="30" src="etherscan.svg" width="30" />
          </a>
          {address}
        </button>
      </div>
    ));
  };

  handleArbitrationPriceChange = () => (e) => {
    console.log(e);
    this.setState({ arbitrationCost: e.target.value });
  };

  notificationCallback = (notification, time) => {
    this.setState((state) => ({
      notifications: [...state.notifications, { notification, time }],
    }));
  };

  clearNotificationsCallback = () => {
    this.setState(() => ({
      notifications: [],
    }));
  };

  handleCustomAddressValueChange = (e) => {
    this.setState({ customAddressValue: e.target.value });
  };

  render() {
    const { arbitrationCost, archon, customAddressValue, networkType, notifications, selectedAddress, wallet } = this.state;

    if (!wallet) return <div>Please unlock your MetaMask and refresh the page to continue.</div>;
    return (
      <div className="container-fluid">
        {wallet && (
          <div className="row">
            <div className="col p-0">
              <NavBar clearNotifications={this.clearNotificationsCallback} networkType={networkType} notifications={notifications} wallet={wallet} web3={web3} />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col text-center">
            <h4 className="text-center">Select A Deployed Centralized Arbitrator</h4>
            <div className="row mb-3">
              <div className="col-md-1 pb-10 mb-6 align-top">
                <Identicon bgColor="#4004A3" className="identicon rounded-circle" color="#009AFF" networkType={networkType} scale={3} seed={selectedAddress} size={13} spotColor="white" />
              </div>
              <div className="col p-0">
                <div className="input-group">
                  <input className="form-control" disabled placeholder="Please select a centralized arbitrator contract" type="text" value={selectedAddress} />
                  <div className="input-group-append">
                    <button aria-expanded="false" aria-haspopup="true" className="btn btn-secondary dropdown-toggle primary" data-toggle="dropdown" id="dropdownMenuButton" type="button">
                      Select
                    </button>
                    <div aria-labelledby="dropdownMenuButton" className="dropdown-menu dropdown-menu-right">
                      <h5 className="text-center my-3">Contract Addresses</h5>
                      <div className="dropdown-divider" />

                      {this.centralizedArbitratorButtons(lscache.get(this.state.wallet) ? lscache.get(this.state.wallet) : [])}
                      <div className="dropdown-divider" />
                      <div className="px-3 m-3">
                        <label className="px-3">
                          <b>Enter Custom Address</b>
                        </label>
                        <div className="input-group px-3">
                          <input aria-describedby="basic-addon2" aria-label="Recipient's username" className="form-control" onChange={this.handleCustomAddressValueChange} placeholder="0x..." type="text" value={customAddressValue} />
                          <div className="input-group-append">
                            <button className="btn btn-outline-secondary primary" onClick={this.handleCentralizedArbitratorDropdownButtonClick(customAddressValue)} type="button">
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="col">
              <h4>Deploy A New Centralized Arbitrator</h4>
              <div className="row">
                <div className="col">
                  <div className="input-group mb-3">
                    <input aria-describedby="basic-addon1" aria-label="" className="form-control" onChange={this.handleArbitrationPriceChange()} placeholder="Please enter desired arbitration price (ETH)" type="text" value={arbitrationCost} />
                    <div className="input-group-append">
                      <button className="btn btn-primary primary" onClick={this.deploy(wallet, arbitrationCost)} type="button">
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="secondary" />
        {selectedAddress && (
          <div>
            <div className="row">
              <div className="col-md-6 offset-md-3 pt-3">
                <ArbitrationPrice activeWallet={wallet} contractAddress={selectedAddress} web3={web3} />
              </div>
            </div>
            <hr />
            <div className="row my-5">
              <div className="col">
                <div className="disputes">{selectedAddress && wallet && <DisputeList activeWallet={wallet} archon={archon} contractAddress={selectedAddress} networkType={networkType} notificationCallback={this.notificationCallback} />}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
