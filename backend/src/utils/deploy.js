const { ethers } = require('ethers');
const FileRegistry = require('../blockchain/abis/FileRegistry.json');
const Payment = require('../blockchain/abis/Payment.json');
const Audit = require('../blockchain/abis/Audit.json');
const provider = require('./provider');

const deployContract = async (contractName, contractABI, constructorArgs = []) => {
    const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);
    const ContractFactory = new ethers.ContractFactory(contractABI.abi, contractABI.bytecode, wallet);
    const contract = await ContractFactory.deploy(...constructorArgs);
    await contract.deployed();
    return contract.address;
};

const deploy = async () => {
    const fileRegistryAddress = await deployContract('FileRegistry', FileRegistry);
    const paymentAddress = await deployContract('Payment', Payment);
    const auditAddress = await deployContract('Audit', Audit);
    
    console.log('FileRegistry deployed at:', fileRegistryAddress);
    console.log('Payment deployed at:', paymentAddress);
    console.log('Audit deployed at:', auditAddress);
};

deploy();
