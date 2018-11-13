import web3 from './web3'
import arbitrable from 'kleros-interaction/build/contracts/Arbitrable.json'

export const arbitrableInstanceAt = (address) => {
  return new web3.eth.Contract(arbitrable.abi, address, {gasPrice: 20000000000})
}
