import { INFURA_ID } from './infura-endpoint.js'
import Web3 from 'web3'

let web3

window.addEventListener('load', async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      // Acccounts now exposed
    } catch (_) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) window.web3 = new Web3(window.ethereum)
  // Acccounts always exposed
  // Non-dapp browsers...
  else
    console.log(
      'Non-Ethereum browser detected. You should consider trying MetaMask!'
    )
})

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  // Fallback provider.
  web3 = new Web3(getReadOnlyRpcUrl);
}

export default web3;

const chainIdToRpcEndpoint = {
  1: 'https://mainnet.infura.io/v3/' + INFURA_ID,
  3: 'https://ropsten.infura.io/v3/' + INFURA_ID,
  4: 'https://rinkeby.infura.io/v3/' + INFURA_ID,
  5: 'https://goerli.infura.io/v3/' + INFURA_ID,
  42: 'https://kovan.infura.io/v3/' + INFURA_ID,
  77: 'https://sokol.poa.network',
  100: 'https://rpc.xdaichain.com',
};

export function getReadOnlyRpcUrl({ chainId }) {
  const url = chainIdToRpcEndpoint[chainId];
  if (!url) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  return url;
}

export function getReadOnlyWeb3({ chainId }) {
  return new Web3(getReadOnlyRpcUrl({ chainId }));
}
