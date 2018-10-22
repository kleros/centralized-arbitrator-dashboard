const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const centralizedArbitrator = require('../node_modules/kleros-interaction/build/contracts/CentralizedArbitrator.json');

const mnemonic = 'emerge cabbage panel need lens sweet assault benefit broken lunch insect differ';

const provider = new HDWalletProvider(
  mnemonic,
  'https://rinkeby.infura.io/v3/344bdb3c652c4ce6acc12f10a7557ba6'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const contract = await new web3.eth.Contract(centralizedArbitrator.abi)

  const arbitratorFee = 5; // TODO Parameterize this

  const result = await contract.deploy({ data: centralizedArbitrator.bytecode, arguments: [arbitratorFee] })
  .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address); // TODO Write deployed address somewhere and read from centralizedArbitrator.js
};
deploy();
