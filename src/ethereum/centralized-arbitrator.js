import centralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

import web3 from './web3'

console.log(web3)

export const arbitratorInstance = new web3.eth.Contract(
  centralizedArbitrator.abi,
  '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913',
  { from: '0x93814d65E91850FE137A23317e2708baD04F0867', gasPrice: 20000000000 } // TODO Refactor hardcoded from address
)

console.log(arbitratorInstance)

export const getOwner = async () => arbitratorInstance.methods.owner().call()

export const getArbitrationCost = async extraData =>
  arbitratorInstance.methods
    .arbitrationCost(web3.utils.utf8ToHex(extraData))
    .call()

export const setArbitrationPrice = async arbitrationPrice =>
  arbitratorInstance.methods.setArbitrationPrice(arbitrationPrice).send()

export const getDispute = async index =>
  arbitratorInstance.methods.disputes(index).call()

export const getDisputeStatus = async index =>
  arbitratorInstance.methods.disputeStatus(index).call()

export const giveRuling = async (disputeID, ruling) =>
  arbitratorInstance.methods.giveRuling(disputeID, ruling).send()
