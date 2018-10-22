import web3 from './web3'
import CentralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

console.log(web3)

export const instance = new web3.eth.Contract(
  CentralizedArbitrator.abi,
  '0x9b0cB8e6e96965B3457b407042E42146E5b8cE73',
  {from: "0x93814d65E91850FE137A23317e2708baD04F0867", gasPrice: 20000000000} // TODO Refactor hardcoded from address
)

console.log(instance)


export const getOwner = async () => {
  return instance.methods.owner().call()
}

export const getArbitrationCost = async (extraData) => {
  return instance.methods.arbitrationCost(web3.utils.utf8ToHex(extraData)).call()
}

export const setArbitrationPrice = async (arbitrationPrice) => {
  return instance.methods.setArbitrationPrice(arbitrationPrice).send()
}

export const getDispute = async (index) => {
  return instance.methods.disputes(index).call()
}

export const disputeCreationEvent = () => {
  let event = instance.events.DisputeCreation
  console.log("event: " + event)
  return event
}
