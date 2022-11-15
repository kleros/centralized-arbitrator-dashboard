import {
  autoAppealableArbitratorInstance,
  getArbitrationCost,
  setArbitrationPrice,
} from "../ethereum/auto-appealable-arbitrator"
import React, { useEffect, useState } from "react"
import Web3 from "../ethereum/web3"

const ArbitrationPrice = ({
  activeWallet,
  contractAddress,
  web3,
}: {
  activeWallet: string
  contractAddress: string
  web3: typeof Web3
}) => {
  const [arbitrationCost, setArbitrationCost] = useState("")

  useEffect(() => {
    const fromWeiGetArbitrationCost = async () => {
      const result = web3.utils.fromWei(
        await getArbitrationCost(
          autoAppealableArbitratorInstance(contractAddress),
          ""
        ),
        "ether"
      )
      setArbitrationCost(result)
    }
    fromWeiGetArbitrationCost()
    
  }, [contractAddress])

  const handleSetArbitrationPriceButtonClick =
    (newCost: string) => async (e: { preventDefault: () => void }) => {
      const autoAppealableArbitrator =
        autoAppealableArbitratorInstance(contractAddress)
      e.preventDefault()
      setArbitrationCost("awaiting...")
      await setArbitrationPrice(
        activeWallet,
        autoAppealableArbitrator,
        web3.utils.toWei(newCost, "ether")
      )
      const arbitrationCost = web3.utils.fromWei(
        await getArbitrationCost(autoAppealableArbitrator, ""),
        "ether"
      )
      setArbitrationCost(arbitrationCost)
    }

  const handleArbitrationPriceChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    console.log(e)
    setArbitrationCost(e.target.value)
  }

  return (
    <div className="input-group mb-3">
      <div className="input-group-append">
        <label className="input-group-text bg-white border-0" id="">
          Arbitration Price (ETH)
        </label>
      </div>
      <input
        aria-describedby="basic-addon"
        aria-label=""
        className="form-control"
        onChange={handleArbitrationPriceChange}
        placeholder="Arbitration Price"
        type="text"
        value={arbitrationCost}
      />
      <div className="input-group-prepend">
        <button
          className="btn btn-primary primary"
          onClick={handleSetArbitrationPriceButtonClick(arbitrationCost)}
          type="button"
        >
          Change Arbitration Fee
        </button>
      </div>
    </div>
  )
}

export default ArbitrationPrice
