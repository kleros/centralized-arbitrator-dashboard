import web3 from './web3'
import Contract from 'truffle-contract';
import CentralizedArbitrator from 'kleros-interaction/build/contracts/CentralizedArbitrator.json'

const instance = Contract(CentralizedArbitrator)

export default instance
