import web3 from './web3'
import multipleArbitrableTransaction from 'kleros-interaction/build/contracts/MultipleArbitrableTransaction.json'
import arbitrable from 'kleros-interaction/build/contracts/Arbitrable.json'

console.log(web3)

export const arbitrableInstance = new web3.eth.Contract(
  multipleArbitrableTransaction.abi,
  '0x40EA6D371a0f8F78b9eed75D2b309B4ACEbbad29',
  {gasPrice: 20000000000}
)

export const arbitrableInstanceAt = (address) => {
  return new web3.eth.Contract(multipleArbitrableTransaction.abi, address, {gasPrice: 20000000000})
}

console.log(arbitrableInstance)
