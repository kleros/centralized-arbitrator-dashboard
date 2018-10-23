import web3 from './web3'
import centralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'
import arbitrator from 'kleros-interaction/build/contracts/Arbitrator.json'

console.log(web3)

export const arbitratorInstance = new web3.eth.Contract(
  arbitrator.abi,
  '0x381F5C07529f1d0f8D3A7394a7448218e316eA80',
  {from: "0x93814d65E91850FE137A23317e2708baD04F0867", gasPrice: 20000000000} // TODO Refactor hardcoded from address
)

console.log(arbitratorInstance)


export const getOwner = async () => {
  //return instance.methods.owner().call()
  return ""
}

export const getArbitrationCost = async (extraData) => {
  return arbitratorInstance.methods.arbitrationCost(web3.utils.utf8ToHex(extraData)).call()
}

export const setArbitrationPrice = async (arbitrationPrice) => {
  return arbitratorInstance.methods.setArbitrationPrice(arbitrationPrice).send()
}

// export const getDispute = async (index) => {
//   return arbitratorInstance.methods.disputes(index).call()
// }

export const disputeCreationEvent = () => {
  let event = arbitratorInstance.events.DisputeCreation
  console.log("event: " + event)
  return event
}

export const getDisputeStatus = (index) => {
  return arbitratorInstance.methods.disputeStatus(index).call()
}
