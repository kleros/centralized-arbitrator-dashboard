import web3 from './web3'
import centralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

console.log(web3)

export const arbitratorInstance = new web3.eth.Contract(
  centralizedArbitrator.abi,
  '0x0390a40087Ce12d5603659cd1e9d78Cb715b7913'
)

console.log(arbitratorInstance)


export const getOwner = async () => {
  return arbitratorInstance.methods.owner().call()
}

export const getArbitrationCost = async (extraData) => {
  return arbitratorInstance.methods.arbitrationCost(web3.utils.utf8ToHex(extraData)).call()
}

export const setArbitrationPrice = async (arbitrationPrice) => {
  return arbitratorInstance.methods.setArbitrationPrice(arbitrationPrice).send()
}

export const getDispute = async (index) => {
  return arbitratorInstance.methods.disputes(index).call()
}

export const disputeCreationEvent = () => {
  let event = arbitratorInstance.events.DisputeCreation
  console.log("event: " + event)
  return event
}

export const getDisputeStatus = (index) => {
  return arbitratorInstance.methods.disputeStatus(index).call()
}
