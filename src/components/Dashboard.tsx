import $ from "jquery"
import ArbitrationPrice from "./ArbitrationPrice"
import Archon from "@kleros/archon"
import DisputeList from "./DisputeList"
import Identicon from "./Identicon"
import NavBar from "./Navbar"
// import { RateLimiter } from 'limiter'
import React, { useEffect, useState } from "react"
import { deployAutoAppealableArbitrator } from "../ethereum/auto-appealable-arbitrator"
import web3 from "../ethereum/web3"

import lscache from "lscache"
import { NotificationType } from "../types"
//import NotificationItem from "./NotificationItem"

const NETWORKS = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
} as unknown as string[]

const Dashboard = () => {
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

  const [archon, setArchon] = useState({})
  const [uglyFixtoBug13, setUglyFixtoBug13] = useState("") // See https://github.com/kleros/centralized-arbitrator-dashboard/issues/13
  const [networkType, setNetworkType] = useState("")
  const [wallet, setWallet] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("")
  const [arbitrationCost, setArbitrationCost] = useState("")
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [customAddressValue, setCustomAddressValue] = useState("")

  const apiPrefix = (networkType: string) => {
    switch (networkType) {
      case "mainnet":
        return " "
      case "kovan":
        return "kovan."
      case "ropsten":
        return "ropsten."
      case "goerli":
        return "goerli."
      case "rinkeby":
        return "rinkeby."
      default:
        return " "
    }
  }

  useEffect(() => {
    setArchon(new Archon(window.ethereum, "https://ipfs.kleros.io"))

    $("*").on("click", () => {
      setUglyFixtoBug13("")
    })

    const connectToBlockchain = async () => {
      const ethereum = window.ethereum
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })

      web3.eth.net.getNetworkType((_error, networkTypeGet) => {
        
        setNetworkType(networkTypeGet == "main" ? "mainnet" : networkTypeGet)
        setWallet(accounts[0].toLowerCase())
        if (lscache.get(accounts[0]))
          setSelectedAddress(
            lscache.get(accounts[0] + networkType)[0].toLowerCase()
          )
      })
    }

    if (window.ethereum) {
      connectToBlockchain()
    } else console.log("MetaMask account not detected :(")

    window.ethereum.on("accountsChanged", (accounts: string) => {
      web3.eth.net.getNetworkType((error: Error, networkTypeGet: string) => {
        if (error) console.error(error)
        setNetworkType(networkTypeGet == "main" ? "mainnet" : networkTypeGet)
        setSelectedAddress("")
        setWallet(accounts[0].toLowerCase())
      })
    })

    window.ethereum.on("chainChanged", (networkId: string) => {
      setNetworkType(NETWORKS[web3.utils.hexToNumber(networkId)])
      setSelectedAddress("")
    })
  }, [])

  const deploy =
    (account: string, arbitrationPrice: string) =>
    async (e: { preventDefault: () => void }) => {
      e.preventDefault()

      const result = await deployAutoAppealableArbitrator(
        account,
        web3.utils.toWei(arbitrationPrice, "ether")
      )
      setSelectedAddress(result._address.toLowerCase())

      if (!lscache.get(wallet + networkType))
        lscache.set(wallet + networkType, [result._address.toLowerCase()])
      else {
        const currentItem = lscache.get(wallet + networkType)
        const newItem = [...currentItem, result._address.toLowerCase()]
        lscache.set(wallet + networkType, newItem)
      }

      setArchon(archon)
      setUglyFixtoBug13(uglyFixtoBug13)
      setNetworkType(networkType)
      setWallet(wallet)
      setSelectedAddress(selectedAddress)
      setArbitrationCost(arbitrationCost)
      setNotifications(notifications)
      setCustomAddressValue(customAddressValue)
    }

  /*const handleCentralizedArbitratorDropdownKeyEnter = (e: { keyCode: number; target: { value: React.SetStateAction<string> } }) => {
    if (e.keyCode === 13) setSelectedAddress(e.target.value)
  }*/

  const handleCentralizedArbitratorDropdownButtonClick = (
    address: React.SetStateAction<string>
  ) => {
    setSelectedAddress(address)
  }

  const centralizedArbitratorButtons = (addresses: string[]) => {
    return addresses.map((address: string) => (
      <div className="dropdown-item p-0" key={address}>
        <button
          className="dropdown-item "
          key={address}
          onClick={() =>
            handleCentralizedArbitratorDropdownButtonClick(address)
          }
        >
          <a
            href={`https://${apiPrefix(
              networkType
            )}etherscan.io/address/${address}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="etherscan-logo"
              className="m-2"
              height="30"
              src="etherscan.svg"
              width="30"
            />
          </a>
          {address}
        </button>
      </div>
    ))
  }

  const handleArbitrationPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArbitrationCost(e.target.value)
  }

  const notificationCallback = (text: string, time: number) => {
    setNotifications([...notifications, { text, time }])
  }

  const clearNotificationsCallback = () => {
    setNotifications([])
  }

  const handleCustomAddressValueChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setCustomAddressValue(e.target.value)
  }

  if (!wallet)
    return (
      <div>Please unlock your MetaMask and refresh the page to continue.</div>
    )
  return (
    <div className="container-fluid">
      {wallet && (
        <div className="row">
          <div className="col p-0">
            <NavBar
              clearNotifications={clearNotificationsCallback}
              networkType={networkType}
              notifications={notifications}
              wallet={wallet}
              web3={web3}
            />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col text-center">
          <h4 className="text-center">
            Select A Deployed Centralized Arbitrator
          </h4>
          <div className="row mb-3">
            <div className="col-md-1 pb-10 mb-6 align-top">
              <Identicon
                bgColor="#4004A3"
                className="identicon rounded-circle"
                color="#009AFF"
                networkType={networkType}
                scale={3}
                seed={selectedAddress || ""}
                size={13}
                spotColor="white"
              />
            </div>
            <div className="col p-0">
              <div className="input-group">
                <input
                  className="form-control"
                  disabled
                  placeholder="Please select a centralized arbitrator contract"
                  type="text"
                  value={selectedAddress}
                />
                <div className="input-group-append">
                  <button
                    aria-expanded="false"
                    aria-haspopup="true"
                    className="btn btn-secondary dropdown-toggle primary"
                    data-toggle="dropdown"
                    id="dropdownMenuButton"
                    type="button"
                  >
                    Select
                  </button>
                  <div
                    aria-labelledby="dropdownMenuButton"
                    className="dropdown-menu dropdown-menu-right"
                  >
                    <h5 className="text-center my-3">Contract Addresses</h5>
                    <div className="dropdown-divider" />

                    {centralizedArbitratorButtons(
                      lscache.get(wallet + networkType)
                        ? lscache.get(wallet + networkType)
                        : []
                    )}
                    <div className="dropdown-divider" />
                    <div className="px-3 m-3">
                      <label className="px-3">
                        <b>Enter Custom Address</b>
                      </label>
                      <div className="input-group px-3">
                        <input
                          aria-describedby="basic-addon2"
                          aria-label="Recipient's username"
                          className="form-control"
                          onChange={handleCustomAddressValueChange}
                          placeholder="0x..."
                          type="text"
                          value={customAddressValue}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-outline-secondary primary"
                            onClick={() =>
                              handleCentralizedArbitratorDropdownButtonClick(
                                customAddressValue
                              )
                            }
                            type="button"
                          >
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
                  <input
                    aria-describedby="basic-addon1"
                    aria-label=""
                    className="form-control"
                    onChange={(event) => handleArbitrationPriceChange(event)}
                    placeholder="Please enter desired arbitration price (ETH)"
                    type="text"
                    value={arbitrationCost}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary primary"
                      onClick={deploy(wallet, arbitrationCost)}
                      type="button"
                    >
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
              <ArbitrationPrice
                activeWallet={wallet}
                contractAddress={selectedAddress}
                web3={web3}
              />
            </div>
          </div>
          <hr />
          <div className="row my-5">
            <div className="col">
              <div className="disputes">
                {selectedAddress && wallet && (
                  <DisputeList
                    activeWallet={wallet}
                    archon={archon}
                    contractAddress={selectedAddress}
                    networkType={networkType}
                    notificationCallback={notificationCallback}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
