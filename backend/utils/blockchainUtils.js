// utils/blockchainUtils.js
const Web3 = require('web3');
const contractConfig = require('../config/contract.json');
require('dotenv').config();

const web3 = new Web3(process.env.NETWORK_URL);
const contract = new web3.eth.Contract(contractConfig.abi, contractConfig.address);

const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const gasPrice = '1'; // Set to 1 wei for testing

exports.uploadFileMetadata = async (fileHash, filename, storjPath, size, mimeType) => {
  try {
    const gas = await contract.methods.uploadFile(fileHash, filename, storjPath, size, mimeType).estimateGas({ from: account.address });
    const result = await contract.methods.uploadFile(fileHash, filename, storjPath, size, mimeType).send({ 
      from: account.address, 
      gas,
      gasPrice
    });
    return result;
  } catch (error) {
    console.error('Error uploading file metadata to blockchain:', error);
    throw new Error('Blockchain upload failed');
  }
};

exports.deleteFileMetadata = async (fileHash) => {
  try {
    const gas = await contract.methods.deleteFile(fileHash).estimateGas({ from: account.address });
    const result = await contract.methods.deleteFile(fileHash).send({ 
      from: account.address, 
      gas,
      gasPrice
    });
    return result;
  } catch (error) {
    console.error('Error deleting file metadata from blockchain:', error);
    throw new Error('Blockchain deletion failed');
  }
};

exports.getFileMetadata = async (fileHash) => {
  try {
    const result = await contract.methods.getFile(fileHash).call({ from: account.address });
    return {
      filename: result[0],
      storjPath: result[1],
      size: result[2],
      mimeType: result[3],
      owner: result[4],
      timestamp: result[5],
      hasAccess: result[6]
    };
  } catch (error) {
    console.error('Error getting file metadata from blockchain:', error);
    throw new Error('Blockchain retrieval failed');
  }
};

exports.updateFileAccess = async (fileHash, user, hasAccess) => {
  try {
    const gas = await contract.methods.updateFileAccess(fileHash, user, hasAccess).estimateGas({ from: account.address });
    const result = await contract.methods.updateFileAccess(fileHash, user, hasAccess).send({ 
      from: account.address, 
      gas,
      gasPrice
    });
    return result;
  } catch (error) {
    console.error('Error updating file access on blockchain:', error);
    throw new Error('Blockchain access update failed');
  }
};

exports.transferFile = async (fileHash, newOwner) => {
  try {
    const gas = await contract.methods.transferFile(fileHash, newOwner).estimateGas({ from: account.address });
    const result = await contract.methods.transferFile(fileHash, newOwner).send({ 
      from: account.address, 
      gas,
      gasPrice
    });
    return result;
  } catch (error) {
    console.error('Error transferring file on blockchain:', error);
    throw new Error('Blockchain file transfer failed');
  }
};

exports.checkFileAccess = async (fileHash, user) => {
  try {
    const result = await contract.methods.checkFileAccess(fileHash, user).call();
    return result;
  } catch (error) {
    console.error('Error checking file access on blockchain:', error);
    throw new Error('Blockchain access check failed');
  }
};

exports.getFileHistory = async (fileHash) => {
  try {
    const events = await contract.getPastEvents('allEvents', {
      filter: { fileHash: fileHash },
      fromBlock: 0,
      toBlock: 'latest'
    });
    return events.map(event => ({
      event: event.event,
      returnValues: event.returnValues,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    }));
  } catch (error) {
    console.error('Error getting file history from blockchain:', error);
    throw new Error('Blockchain history retrieval failed');
  }
};