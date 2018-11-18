import Web3 from 'web3'

import { INFURA_ENDPOINT } from './infura-endpoint.js'

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  console.log('Using the web3 object of the window...')
  web3 = new Web3(window.web3.currentProvider)
} else {
  console.warn(
    "Couldn't find the web3 object of the window, falling back to Infura."
  )
  Web3.providers.HttpProvider.prototype.sendAsync =
    Web3.providers.HttpProvider.prototype.send
  const provider = new Web3.providers.HttpProvider(INFURA_ENDPOINT)
  web3 = new Web3(provider)
}

export default web3
