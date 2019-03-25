import AutoAppealableArbitrator from '@kleros/kleros-interaction/build/contracts/AutoAppealableArbitrator.json'
import web3 from './web3'

export const deployAutoAppealableArbitrator = (account, arbitrationPrice) =>
  new web3.eth.Contract(AutoAppealableArbitrator.abi)
    .deploy({
      arguments: [arbitrationPrice],
      data: AutoAppealableArbitrator.bytecode
    })
    .send({ from: account })

export const autoAppealableArbitratorInstance = address =>
  new web3.eth.Contract(AutoAppealableArbitrator.abi, address, {
    gasPrice: 20000000000
  })

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

export const giveAppelableRuling = async (
  account,
  arbitratorInstance,
  disputeID,
  ruling,
  appealCost,
  timeToAppeal
) =>
  arbitratorInstance.methods
    .giveAppealableRuling(disputeID, ruling, appealCost, timeToAppeal)
    .send({ from: account })
