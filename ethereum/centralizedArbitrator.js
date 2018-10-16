import web3 from './web3'
import CentralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

const instance = new web3.eth.Contract(
  CentralizedArbitrator.abi,
  '0x9b0cB8e6e96965B3457b407042E42146E5b8cE73'
)

export default instance
