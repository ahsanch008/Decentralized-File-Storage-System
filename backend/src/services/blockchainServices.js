const { ethers } = require('ethers');
const FileRegistryABI = require('../blockchain/abis/FileRegistry.json');
const PaymentABI = require('../blockchain/abis/Payment.json');
const AuditABI = require('../blockchain/abis/Audit.json');
const provider = require('../utils/provider');

const contractAddresses = {
    fileRegistry: process.env.FILE_REGISTRY_CONTRACT_ADDRESS,
    payment: process.env.PAYMENT_CONTRACT_ADDRESS,
    audit: process.env.AUDIT_CONTRACT_ADDRESS,
};

const getContract = (contractName, ABI) => {
    const contractAddress = contractAddresses[contractName];
    return new ethers.Contract(contractAddress, ABI, provider);
};

const fileRegistryContract = getContract('fileRegistry', FileRegistryABI);
const paymentContract = getContract('payment', PaymentABI);
const auditContract = getContract('audit', AuditABI);

exports.registerFile = async (fileHash, fileName) => {
    const tx = await fileRegistryContract.registerFile(fileHash, fileName);
    await tx.wait();
    return tx;
};

exports.getFile = async (fileHash) => {
    const file = await fileRegistryContract.getFile(fileHash);
    return file;
};

exports.makePayment = async (amount) => {
    const tx = await paymentContract.pay({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    return tx;
};
