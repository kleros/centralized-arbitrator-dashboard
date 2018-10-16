import Web3 from 'web3'
import {INFURA_ENDPOINT} from './infuraEndpoint.js'

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider)
} else {
   Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
  const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT)
  web3 = new Web3(provider)
}

export default web3
