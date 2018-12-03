import centralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'
import web3 from './web3'

export const deployCentralizedArbitrator = (account, arbitrationPrice) => {
  new web3.eth.Contract(centralizedArbitrator.abi)
    .deploy({
      arguments: [arbitrationPrice],
      data: centralizedArbitrator.bytecode
    })
    .send({ from: account })
}

export const centralizedArbitratorInstance = address =>
  new web3.eth.Contract(
    centralizedArbitrator.abi,
    address,
    {
      gasPrice: 20000000000
    } // TODO Refactor hardcoded from address
  )

export const getOwner = async arbitratorInstance =>
  arbitratorInstance.methods.owner().call()

export const getArbitrationCost = async (arbitratorInstance, extraData) =>
  arbitratorInstance.methods
    .arbitrationCost(web3.utils.utf8ToHex(extraData))
    .call()

export const setArbitrationPrice = async (
  account,
  arbitratorInstance,
  arbitrationPrice
) =>
  arbitratorInstance.methods
    .setArbitrationPrice(arbitrationPrice)
    .send({ from: account })

export const getDispute = async (arbitratorInstance, index) =>
  arbitratorInstance.methods.disputes(index).call()

export const getDisputeStatus = async (arbitratorInstance, index) =>
  arbitratorInstance.methods.disputeStatus(index).call()

export const giveRuling = async (
  account,
  arbitratorInstance,
  disputeID,
  ruling
) =>
  arbitratorInstance.methods
    .giveRuling(disputeID, ruling)
    .send({ from: account })
