import { INFURA_ENDPOINT } from './infura-endpoint.js'
import Web3 from 'web3'

let web3

window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
      // Request account access if needed
      await window.ethereum.enable()
      // Acccounts now exposed
    } catch (_) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) window.web3 = new Web3(web3.currentProvider)
  // Acccounts always exposed
  // Non-dapp browsers...
  else
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    )
})

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
