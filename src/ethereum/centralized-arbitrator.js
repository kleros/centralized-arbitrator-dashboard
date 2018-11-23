import centralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

import web3 from './web3'

export const arbitratorInstance = address => new web3.eth.Contract(
  centralizedArbitrator.abi,
  address,
  { from: '0x93814d65E91850FE137A23317e2708baD04F0867', gasPrice: 20000000000 } // TODO Refactor hardcoded from address
)

export const getOwner = async (arbitratorInstance) => arbitratorInstance.methods.owner().call()

export const getArbitrationCost = async (arbitratorInstance, extraData) =>
  arbitratorInstance.methods
    .arbitrationCost(web3.utils.utf8ToHex(extraData))
    .call()

export const setArbitrationPrice = async (arbitratorInstance, arbitrationPrice) =>
  arbitratorInstance.methods.setArbitrationPrice(arbitrationPrice).send()

export const getDispute = async (arbitratorInstance, index) =>
  arbitratorInstance.methods.disputes(index).call()

export const getDisputeStatus = async (arbitratorInstance, index) =>
  arbitratorInstance.methods.disputeStatus(index).call()

export const giveRuling = async (arbitratorInstance, disputeID, ruling) =>
  arbitratorInstance.methods.giveRuling(disputeID, ruling).send()
