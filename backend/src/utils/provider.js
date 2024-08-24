const { JsonRpcProvider } = require('ethers');
const config = require('../config');

const provider = new JsonRpcProvider(config.ethereum.providerUrl);

module.exports = provider;
