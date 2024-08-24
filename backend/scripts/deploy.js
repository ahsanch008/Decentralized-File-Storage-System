// scripts/deploy.js
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const web3 = new Web3(process.env.NETWORK_URL);

const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const contractPath = path.join(__dirname, '../contracts/FileRegistry.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const solc = require('solc');

const input = {
  language: 'Solidity',
  sources: {
    'FileRegistry.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = compiledContract.contracts['FileRegistry.sol'].FileRegistry.abi;
const bytecode = compiledContract.contracts['FileRegistry.sol'].FileRegistry.evm.bytecode.object;

const deploy = async () => {
  const contract = new web3.eth.Contract(abi);
  const deployTx = contract.deploy({ data: bytecode });
  const gas = await deployTx.estimateGas();
  
  const deployedContract = await deployTx
    .send({
      from: account.address,
      gas,
    })
    .on('receipt', (receipt) => {
      console.log('Contract deployed at:', receipt.contractAddress);
      // Save the contract address and ABI to a file for later use
      fs.writeFileSync(
        path.join(__dirname, '../config/contract.json'),
        JSON.stringify({ address: receipt.contractAddress, abi }, null, 2)
      );
    });
};

deploy();